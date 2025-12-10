const express = require('express');
const app = express();
const db = require('./config/db.config.js');
const Relations = require("./models/Relations.js");
const cors = require('cors');

const PORT = process.env.PORT || 5002;

const chapterRoutes = require('./routes/chapter.js');
const developmentDirectionRoutes = require('./routes/developmentDirection.js');
const disciplineRoutes = require('./routes/discipline.js');
const disciplineSkillRoutes = require('./routes/disciplineSkill.js');
const disciplineTeacherRoutes = require('./routes/disciplineTeacher.js');
const eventRoutes = require('./routes/event.js');
const languageRoutes = require('./routes/language.js');
const lessonRoutes = require('./routes/lesson.js');
const levelRoutes = require('./routes/level.js');
const materialRoutes = require('./routes/material.js');
const skillRoutes = require('./routes/skill.js');
const skillChapterRoutes = require('./routes/skillChapter.js');
const teacherRoutes = require('./routes/teacher.js');
const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.js');
const cacheRoutes = require('./routes/cache.js');
const resourceRoutes = require('./routes/resource.js');
const interactionUserResourceRoutes = require('./routes/interaction_user_resource.js')
const commentRoutes = require('./routes/comment.js')
const linkTypeRoutes = require('./routes/linkType.js');
const stackRoutes = require('./routes/stack.js');
const interactionUserStackRoutes = require('./routes/interaction_user_stack.js');
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/chapter', chapterRoutes);
app.use('/developmentDirection', developmentDirectionRoutes);
app.use('/discipline', disciplineRoutes);
app.use('/disciplineSkill', disciplineSkillRoutes);
app.use('/disciplineTeacher', disciplineTeacherRoutes);
app.use('/event', eventRoutes);
app.use('/language', languageRoutes);
app.use('/lesson', lessonRoutes);
app.use('/level', levelRoutes);
app.use('/material', materialRoutes);
app.use('/skill', skillRoutes);
app.use('/skillChapter', skillChapterRoutes);
app.use('/teacher', teacherRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/cache', cacheRoutes);
app.use('/resource', resourceRoutes);
app.use('/interactionUserResource', interactionUserResourceRoutes);
app.use('/comment', commentRoutes);
app.use('/linkType', linkTypeRoutes);
app.use('/stack', stackRoutes);
app.use("/interactionUserStack", interactionUserStackRoutes);

db.sequelize.sync()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Failed to sync models:', err));

module.exports = app;