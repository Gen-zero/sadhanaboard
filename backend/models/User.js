class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.display_name = data.display_name;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Convert to JSON format for API responses
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      display_name: this.display_name,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;