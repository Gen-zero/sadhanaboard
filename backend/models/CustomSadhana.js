class CustomSadhana {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.name = data.name;
    this.description = data.description;
    this.purpose = data.purpose;
    this.goal = data.goal;
    this.deity = data.deity;
    this.message = data.message;
    this.offerings = data.offerings || [];
    this.duration_days = data.duration_days;
    this.is_draft = data.is_draft;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Convert to JSON format for API responses
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      name: this.name,
      description: this.description,
      purpose: this.purpose,
      goal: this.goal,
      deity: this.deity,
      message: this.message,
      offerings: this.offerings,
      duration_days: this.duration_days,
      is_draft: this.is_draft,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = CustomSadhana;