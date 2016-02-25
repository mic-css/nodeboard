var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var taskSchema = new Schema({
  title: String,
  created: Date,
  dueDate: Date,
  importance: { type: Number, min: 1, max: 3, default: 1},
  completed: {type: Boolean, default: false}
});

module.exports= mongoose.model('Task', taskSchema);
