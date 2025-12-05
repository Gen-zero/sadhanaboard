================================================================================
MONGOOSE SCHEMAS - README
================================================================================

This directory contains all Mongoose schema definitions for SaadhanaBoard's
MongoDB database.

================================================================================
WHAT ARE SCHEMAS?
================================================================================

Schemas define:
  - What fields exist in a collection
  - What data types fields accept
  - What validation rules apply
  - What relationships exist to other collections
  - What indexes exist for performance
  - Custom methods and queries

Think of schemas as the blueprint for MongoDB collections.

================================================================================
DIRECTORY STRUCTURE
================================================================================

backend/schemas/
├── README.txt (this file)
├── SchemaTemplate.js (template for new schemas)
├── SCHEMA_CONVENTIONS.txt (naming, patterns, best practices)
├── User.js (authentication user)
├── Profile.js (user profile data)
├── AdminUser.js (admin accounts)
├── AdminSession.js (admin sessions)
├── Waitlist.js (waitlist entries)
├── Sadhana.js (spiritual practices)
├── SadhanaProgress.js (daily progress tracking)
├── SadhanaStoreItem.js (store items)
├── SharedSadhana.js (shared practices)
├── SadhanaLike.js (practice likes)
├── SadhanaComment.js (practice comments)
├── SpiritualBook.js (books in library)
├── BookProgress.js (reading progress)
├── BookBookmark.js (bookmarks in books)
├── BookAnnotation.js (notes in books)
├── Group.js (user groups)
├── GroupMember.js (group membership)
├── Mentorship.js (mentorship relationships)
├── MentorshipGoal.js (mentorship goals)
├── SharedSadhanaLike.js (shared practice likes)
├── AuditLog.js (admin activity logs)
├── SystemMetrics.js (system statistics)
├── FeatureFlag.js (feature toggles)
├── BiReport.js (BI/analytics reports)
├── GoogleSheetsIntegration.js (spreadsheet sync)
├── Badge.js (achievement badges)
├── Achievement.js (user achievements)
├── CMSPage.js (content pages)
├── AdminIntegration.js (admin integrations)
└── Experiment.js (feature experiments)

Total: 30+ schema files

================================================================================
QUICK START - CREATING A NEW SCHEMA
================================================================================

Step 1: Copy the template
  cp SchemaTemplate.js YourSchema.js

Step 2: Edit YourSchema.js
  - Replace "SchemaName" with your schema name
  - Update the collection name
  - Add your fields
  - Add indexes
  - Add methods

Step 3: Follow SCHEMA_CONVENTIONS.txt
  - Use camelCase for fields
  - Use PascalCase for schema names
  - Add proper validation
  - Document everything

Step 4: Test the schema
  - Add to backend/tests/schemas.test.js
  - Run: npm test
  - Verify: Create documents, validate, query

Step 5: Update services
  - Create service file that uses the schema
  - Import: const YourModel = require('./schemas/YourSchema')
  - Use in queries

================================================================================
CORE SCHEMAS - CREATE FIRST
================================================================================

Priority 1 (Authentication - required for everything):
  1. User.js - User accounts
  2. Profile.js - User profile data
  3. AdminUser.js - Admin accounts
  4. AdminSession.js - Admin login sessions

These must be done first because:
  - Other schemas reference User
  - Required for authentication/authorization
  - Needed for testing other schemas

Estimated time: 1 day

================================================================================
FEATURE SCHEMAS - CREATE SECOND
================================================================================

Priority 2 (Core features):
  5. Sadhana.js - Spiritual practices (main feature)
  6. SadhanaProgress.js - Daily tracking
  7. SharedSadhana.js - Sharing/community
  8. SadhanaLike.js, SadhanaComment.js - Engagement

  9. SpiritualBook.js - Books
  10. BookProgress.js, BookBookmark.js, BookAnnotation.js - Reading

These are the core feature schemas that drive the app.

Estimated time: 2-3 days

================================================================================
SECONDARY SCHEMAS - CREATE THIRD
================================================================================

Priority 3 (Secondary features):
  - Group.js, GroupMember.js - Communities
  - Mentorship.js, MentorshipGoal.js - Mentoring
  - Badge.js, Achievement.js - Gamification
  - CMSPage.js - Content management
  
Estimated time: 1-2 days

================================================================================
ADMIN/ANALYTICS SCHEMAS - CREATE LAST
================================================================================

Priority 4 (Admin/Analytics):
  - AuditLog.js - Activity logging
  - SystemMetrics.js - Performance metrics
  - FeatureFlag.js - Feature toggles
  - BiReport.js - Business intelligence
  - GoogleSheetsIntegration.js - Integrations
  - AdminIntegration.js - Admin plugins
  - Experiment.js - A/B testing

These are optional for MVP but needed for production.

Estimated time: 1 day

================================================================================
HOW TO USE SCHEMAS IN SERVICES
================================================================================

Example: Using User schema in a service

  // 1. Import the model
  const User = require('../schemas/User');
  
  // 2. Create a document
  const user = await User.create({
    email: 'user@example.com',
    displayName: 'John Doe'
  });
  
  // 3. Find documents
  const user = await User.findById(userId);
  const users = await User.find({ status: 'active' });
  
  // 4. Update documents
  const updated = await User.findByIdAndUpdate(userId, { displayName: 'Jane' });
  
  // 5. Delete documents
  await User.findByIdAndDelete(userId);
  
  // 6. Use custom methods
  const active = await User.findActive();
  
  // 7. Call instance methods
  if (user.isActive) { ... }
  
  // 8. Populate references
  const user = await User.findById(userId).populate('profile');

================================================================================
COMMON PATTERNS
================================================================================

Pattern 1: User owns many items
  In item schema:
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  
  In service:
    const items = await Item.find({ userId });
    const withUser = await Item.findById(id).populate('userId');

Pattern 2: Many-to-many relationship
  In schema:
    userIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  
  In service:
    const items = await Item.findOne().populate('userIds');

Pattern 3: Embedded documents (comments in item)
  In item schema:
    comments: [{
      userId: mongoose.Schema.Types.ObjectId,
      content: String,
      createdAt: { type: Date, default: Date.now }
    }]
  
  In service:
    item.comments.push({ userId, content });
    await item.save();

Pattern 4: Text search
  In schema:
    schema.index({ title: 'text', description: 'text' });
  
  In service:
    const results = await Item.find({ $text: { $search: term } });

Pattern 5: Pagination
  In service:
    const page = 1;
    const limit = 10;
    const items = await Item.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

================================================================================
VALIDATION & ERROR HANDLING
================================================================================

Schema validation happens automatically when:
  - Saving a document: await doc.save()
  - Creating a document: await Model.create(data)
  - Finding and updating: await Model.findByIdAndUpdate(id, data)

Error handling pattern:
  try {
    const doc = await Model.create(data);
    return doc;
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation errors
      throw new Error('Validation failed: ' + error.message);
    }
    if (error.code === 11000) {
      // Handle duplicate key errors
      throw new Error('Duplicate entry');
    }
    throw error;
  }

Common validation errors:
  - ValidationError: Field validation failed
  - CastError: Field type mismatch
  - MongoError 11000: Duplicate on unique field
  - MongoError 12582: Duplicate key error

================================================================================
BEST PRACTICES
================================================================================

DO:
  ✓ Use camelCase for all field names
  ✓ Create indexes on frequently queried fields
  ✓ Use ObjectId for references to other collections
  ✓ Add timestamps to every schema
  ✓ Document all fields and their purposes
  ✓ Validate user input at schema level
  ✓ Use populate() for related documents
  ✓ Test schemas thoroughly before using in services
  ✓ Keep schemas focused on one entity
  ✓ Use methods for common operations

DON'T:
  ✗ Use snake_case for field names
  ✗ Create unnecessary indexes (slow writes)
  ✗ Use String for IDs (use ObjectId)
  ✗ Skip validation
  ✗ Embed large related data (use references)
  ✗ Create circular references
  ✗ Use undefined as default
  ✗ Forget error handling
  ✗ Create overly complex schemas
  ✗ Duplicate data between collections

================================================================================
TESTING SCHEMAS
================================================================================

Before using a schema in services:

1. Create it works:
   const doc = await Model.create({ field: 'value' });
   assert(doc._id);

2. Required validation:
   expect(() => Model.create({ })).toThrow();

3. Type validation:
   expect(() => Model.create({ count: 'not-a-number' })).toThrow();

4. Unique constraint:
   await Model.create({ email: 'test@example.com' });
   expect(() => Model.create({ email: 'test@example.com' })).toThrow();

5. Find operation:
   const doc = await Model.findById(docId);
   assert(doc);

6. Update operation:
   const updated = await Model.findByIdAndUpdate(docId, { field: 'new' });
   assert(updated.field === 'new');

7. Delete operation:
   await Model.findByIdAndDelete(docId);
   const found = await Model.findById(docId);
   assert(!found);

8. Methods work:
   const result = doc.customMethod();
   assert(result);

Full test file: backend/tests/schemas.test.js

================================================================================
TROUBLESHOOTING
================================================================================

Schema not found error:
  Problem: "Cannot find module './schemas/User'"
  Solution: Check filename matches import exactly (case-sensitive)

Field validation not working:
  Problem: Invalid data accepted
  Solution: Check validation syntax in schema definition

Indexes not created:
  Problem: Queries are slow
  Solution: Call schema.index() after field definitions

References not populated:
  Problem: Foreign key still shows ObjectId
  Solution: Add .populate('fieldName') to query

Duplicate key error:
  Problem: Cannot insert because unique constraint violated
  Solution: Check unique indexes and existing data

Type errors:
  Problem: "Cast to Number failed"
  Solution: Ensure correct data type passed to field

Large query results slow:
  Problem: Pagination not used
  Solution: Add .limit().skip() to queries

Memory issues:
  Problem: Loading too much data
  Solution: Use .lean() for read-only queries

================================================================================
RESOURCES
================================================================================

Inside this project:
  - SchemaTemplate.js: Template for creating new schemas
  - SCHEMA_CONVENTIONS.txt: Detailed naming and pattern guide
  - PHASE_2_TODO_LIST.txt: Complete task list

External resources:
  - Mongoose Documentation: https://mongoosejs.com/docs/
  - MongoDB Manual: https://www.mongodb.com/docs/manual/
  - Schema Design Guide: MONGODB_MIGRATION_PLAN.txt (Section 3)

Video tutorials:
  - Mongoose crash course on YouTube
  - MongoDB schema design patterns

================================================================================
GETTING HELP
================================================================================

If you get stuck:

1. Check this README
2. Review SCHEMA_CONVENTIONS.txt
3. Look at SchemaTemplate.js
4. Search Mongoose documentation
5. Check existing schemas for patterns
6. Review error message carefully
7. Check MongoDB logs
8. Ask in documentation or issue tracker

Common questions answered in SCHEMA_CONVENTIONS.txt:
  - Section 1: Naming conventions
  - Section 2: Field definitions
  - Section 3: Indexes
  - Section 4: Validations
  - Section 5: Relationships
  - Section 6: Hooks
  - Section 7: Methods
  - Section 8: Queries

================================================================================
NEXT STEPS
================================================================================

1. Read SCHEMA_CONVENTIONS.txt (detailed guide)
2. Review SchemaTemplate.js (code example)
3. Start creating schemas in priority order
4. Follow the TODO list in PHASE_2_TODO_LIST.txt
5. Test each schema before moving to services
6. Update services to use schemas
7. Run integration tests

Ready to start? Begin with Task 2 in PHASE_2_TODO_LIST.txt!

================================================================================
