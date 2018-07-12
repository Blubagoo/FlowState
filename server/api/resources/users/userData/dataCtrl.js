
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

function postNewData(data) {
	let newData = new Data(data);
  newData.save(err => {
  	if(err){
  		console.error(err);
  	}
  });
  return res.status(201).json(newData).end();
}
function postNewDynamic(data) {
  let newData = new Dynamic(data);
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