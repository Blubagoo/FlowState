'use strict';

const authRoutes = require('./resources/auth/authRouter');
const videoRoutes = require('./resources/tempVideoStrg/videoRoutes');
const dataRoutes = require('./resources/user/userData/dataRoutes');
const userRouter = require('./resources/user/userRouter');

module.exports = function(app) {
	app.use('/api/video', videoRoutes);
	app.use('/api/users/', userRoutes);
	app.use('/api/users/analytics', dataRoutes);  
	app.use('/api/auth/', authRoutes);
}