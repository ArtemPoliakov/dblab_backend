const { Sequelize, DataTypes } = require('sequelize');

const User = require('./User.js');
const Teacher = require('./Teacher.js');
const Language = require('./Language.js');
const Discipline = require('./Discipline.js');
const DisciplineTeacher = require('./DisciplineTeacher.js');
const Lesson = require('./Lesson.js');
const Event = require('./Event.js');
const Material = require('./Material.js');
const DevelopmentDirection = require('./DevelopmentDirection.js');
const Level = require('./Level.js');
const Chapter = require('./Chapter.js');
const Skill = require('./Skill.js');
const SkillChapter = require('./SkillChapter.js');
const DisciplineSkill = require('./DisciplineSkill.js');
const LinkType = require("./LinkType.js");
const Resource = require('./Resource.js');
const Stack = require('./Stack.js');
const InteractionUserResource = require('./InteractionUserResource.js');
const InteractionUserStack = require('./InteractionUserStack.js');
const Comment = require("./Comment.js");
const ResourceStack = require('./ResourceStack.js');
const ResourceDevelopmentDirection = require('./ResourceDevelopmentDirection.js');
const Rating = require('./Rating.js');
const RatingResource = require('./RatingResource.js');

User.hasOne(Teacher, { foreignKey: 'user_Id' });
Teacher.belongsTo(User, { foreignKey: 'user_Id' });

Teacher.belongsToMany(Discipline, { through: DisciplineTeacher, foreignKey: 'teacher_Id' });
Discipline.belongsToMany(Teacher, { through: DisciplineTeacher, foreignKey: 'discipline_Id' });

Teacher.hasMany(DisciplineTeacher, { foreignKey: 'teacher_Id' });
DisciplineTeacher.belongsTo(Teacher, { foreignKey: 'teacher_Id' });

Discipline.hasMany(DisciplineTeacher, { foreignKey: 'discipline_Id' });
DisciplineTeacher.belongsTo(Discipline, { foreignKey: 'discipline_Id' });

Language.hasMany(DisciplineTeacher, { foreignKey: 'language_Id' });
DisciplineTeacher.belongsTo(Language, { foreignKey: 'language_Id' });

Teacher.hasMany(Event, { foreignKey: 'teacher_Id' });
Event.belongsTo(Teacher, { foreignKey: 'teacher_Id' });

Lesson.hasMany(Event, { foreignKey: 'lesson_Id' });
Event.belongsTo(Lesson, { foreignKey: 'lesson_Id' });

Event.hasMany(Material, { foreignKey: 'event_Id' });
Material.belongsTo(Event, { foreignKey: 'event_Id' });

DevelopmentDirection.hasMany(Chapter, { foreignKey: 'development_direction_Id' });
Chapter.belongsTo(DevelopmentDirection, { foreignKey: 'development_direction_Id' });

Level.hasMany(Chapter, { foreignKey: 'level_Id' });
Chapter.belongsTo(Level, { foreignKey: 'level_Id' });

Chapter.belongsToMany(Skill, { through: SkillChapter, foreignKey: 'chapter_Id' });
Skill.belongsToMany(Chapter, { through: SkillChapter, foreignKey: 'skill_Id' });

Chapter.hasMany(SkillChapter, { foreignKey: 'chapter_Id' });
SkillChapter.belongsTo(Chapter, { foreignKey: 'chapter_Id' });

Skill.hasMany(SkillChapter, { foreignKey: 'skill_Id' });
SkillChapter.belongsTo(Skill, { foreignKey: 'skill_Id' });

Discipline.hasMany(DisciplineSkill, { foreignKey: 'discipline_Id' });
DisciplineSkill.belongsTo(Discipline, { foreignKey: 'discipline_Id' });

Skill.hasMany(DisciplineSkill, { foreignKey: 'skill_Id' });
DisciplineSkill.belongsTo(Skill, { foreignKey: 'skill_Id' });

Discipline.belongsToMany(Skill, { through: DisciplineSkill, foreignKey: 'discipline_Id' });
Skill.belongsToMany(Discipline, { through: DisciplineSkill, foreignKey: 'skill_Id' });

Level.hasMany(DisciplineSkill, { foreignKey: 'level_Id' });
DisciplineSkill.belongsTo(Level, { foreignKey: 'level_Id' });

User.hasMany(Resource, { foreignKey: 'author_user_Id' });
Resource.belongsTo(User, {
  foreignKey: {
    name: 'author_user_Id',
    allowNull: true,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

User.hasMany(Stack, { foreignKey: 'author_user_Id' });
Stack.belongsTo(User, {
  foreignKey: {
    name: 'author_user_Id',
    allowNull: true,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

LinkType.hasMany(Resource, { foreignKey: 'link_type_Id' });
Resource.belongsTo(LinkType, {
  foreignKey: {
    name: 'link_type_Id',
    allowNull: true,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

User.hasMany(InteractionUserResource, { foreignKey: 'user_Id' });
InteractionUserResource.belongsTo(User, {
  foreignKey: {
    name: 'user_Id',
    allowNull: true,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Resource.hasMany(InteractionUserResource, { foreignKey: 'resource_Id' });
InteractionUserResource.belongsTo(Resource, {
  foreignKey: {
    name: 'resource_Id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.hasMany(InteractionUserStack, { foreignKey: 'user_Id' });
InteractionUserStack.belongsTo(User, {
  foreignKey: {
    name: 'user_Id',
    allowNull: true,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Stack.hasMany(InteractionUserStack, { foreignKey: 'stack_Id' });
InteractionUserStack.belongsTo(Stack, {
  foreignKey: {
    name: 'stack_Id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

InteractionUserResource.hasMany(Comment, { foreignKey: 'interaction_user_resource_Id' });
Comment.belongsTo(InteractionUserResource, {
  foreignKey: {
    name: 'interaction_user_resource_Id',
    allowNull: true,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

InteractionUserStack.hasMany(Comment, { foreignKey: 'interaction_user_stack_Id' });
Comment.belongsTo(InteractionUserStack, {
  foreignKey: {
    name: 'interaction_user_stack_Id',
    allowNull: true,
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Resource.belongsToMany(Stack, {
  through: ResourceStack,
  foreignKey: 'resource_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Stack.belongsToMany(Resource, {
  through: ResourceStack,
  foreignKey: 'stack_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Resource.belongsToMany(DevelopmentDirection, {
  through: ResourceDevelopmentDirection,
  foreignKey: 'resource_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
DevelopmentDirection.belongsToMany(Resource, {
  through: ResourceDevelopmentDirection,
  foreignKey: 'development_direction_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Rating.belongsToMany(Resource, {
  through: RatingResource,
  foreignKey: 'rating_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Resource.belongsToMany(Rating, {
  through: RatingResource,
  foreignKey: 'resource_Id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});



module.exports = {
    User,
    Teacher,
    Language,
    Discipline,
    DisciplineTeacher,
    Lesson,
    Event,
    Material,
    DevelopmentDirection,
    Level,
    Chapter,
    Skill,
    SkillChapter,
    DisciplineSkill,
    LinkType,
    Resource,
    Stack,
    InteractionUserResource,
    InteractionUserStack,
    Comment,
    ResourceStack,
    ResourceDevelopmentDirection,
    Rating,
    RatingResource
};