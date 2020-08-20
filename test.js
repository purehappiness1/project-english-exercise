const connectAdress = 'mongodb+srv://Maria:Manechka555@cluster0.tt6bc.mongodb.net/english?retryWrites=true&w=majority';
const collectionName = 'tasks';

const fs = require('fs').promises;
const mongoose = require('mongoose');
const SoftSchema = new mongoose.Schema({}, { strict: false });
const Test = mongoose.model(collectionName, SoftSchema);
const readLocal = async () => {
  mongoose.connect('mongodb://localhost:27017/english', { useNewUrlParser: true, useUnifiedTopology: true });
  let result = await Test.find();
  //console.log(result);
  mongoose.disconnect();
  await writeAtlas(result);
}
const writeAtlas = async (data) => {
  mongoose.connect(connectAdress, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async ()=>{
    data2 = JSON.parse(JSON.stringify(data)); // я не могу однозначно ответить зачем я тут дипкопи сделал.
    //data.map(document => new Test(document).save());
    for (let index = 0; index < data2.length; index++) {
      const document = data2[index];
      const newDocument = new Test(document);
      await newDocument.save();
    }
  })
  .then(()=>{
    mongoose.disconnect();
    console.log('all done');
  })
}
readLocal();
