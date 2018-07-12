
const {Dynamic} = require('./dynamicDataModel');
const {Data} = require('./dataModel');

function getUserData(username) {
	  return Data
    .find({
      user: `${username}`
    })
    .sort({ date : 1})
    .then(data =>	res.json(data))
    .catch(err => console.error(err).pretty());
}
function getUserDynamic(username) {
	 return Dynamic
    .find({
      user: `${username}`
    })
    .sort({ date : -1})
    .then(data =>	res.json(data))
    .catch(err => console.error(err).pretty());
}

function postNewData(req, res) {
	let newData = new Data(req.body);
  newData.save(err => {
  	if(err){
  		console.error(err);
  	}
  });
  return res.status(201).json(newData).end();
}
function postNewDynamic(req, res) {
  let newData = new Dynamic(req.body);
  newData.save(err => {
  	if(err){
  		console.error(err);
  	}
  });
  return res.status(201).json(newData);
}



module.exports = {
	getUserData,
	getUserDynamic,
	postNewData,
	postNewDynamic
}