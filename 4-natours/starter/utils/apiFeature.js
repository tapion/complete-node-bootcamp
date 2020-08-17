class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.querySting = queryString;
  }

  filter() {
    const queryObj = { ...this.querySting };
    const keysRemove = ['page', 'sort', 'limit', 'fields'];
    keysRemove.forEach((el) => delete queryObj[el]);
    let querySting = JSON.stringify(queryObj);
    querySting = querySting.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (word) => `$${word}`
    );
    this.query = this.query.find(JSON.parse(querySting));
    return this;
  }

  sort() {
    if (this.querySting.sort) {
      this.query = this.query.sort(this.querySting.sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createAt');
    }
    return this;
  }

  filterFields() {
    if (this.querySting.fields) {
      this.query = this.query.select(
        this.querySting.fields.split(',').join(' ')
      );
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  limit() {
    const limit = this.querySting.limit * 1 || 100;
    const page = this.querySting.page * 1 || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
