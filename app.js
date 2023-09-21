import express from "express";
import bp from "body-parser";
import mongoose from "mongoose";
import http  from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server);

app.use(express.static("public"));
app.use(bp.urlencoded({ extended: true }));


const main = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/to-do-list-db");
  console.log("Connected to MongoDb successfully!");
};

main().catch((err) => console.error(err));

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { strict: false }
);

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [taskSchema]
});

const Task = mongoose.model("Task", taskSchema);
const List = mongoose.model("List",listSchema); 

let date = new Date();
let today_date = date.toDateString();
let year = date.getFullYear();
// console.log(year);



app.get("/", async (req, res) => {
  try {
    const check = await Task.find({});
    
    res.render("index.ejs", {
      todos: check,
      listTitle: "Today",
      date: today_date,
      year: year,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/customLists", async (req, res) => {
  const customListsArray = await List.find();
  res.render("custom.ejs", {lists: customListsArray});
});

app.get("/:customListName",async(req,res) => {
  const customName = req.params.customListName;
  try {
    let foundList = await List.findOne({ name: customName });
    if (!foundList) {
      const list = new List({
        name: customName,
        items: [],
      });
      await list.save();
  
      // Re-query for the newly created list
      foundList = list;
    }
    res.render("index.ejs", { todos: foundList.items,date: today_date, listTitle: foundList.name,year: year, action: customName });
  } catch (err) {
    console.error(err);
  }  
});


app.post("/", async (req, res) => {
  console.log(req.body);
  const newTodo = req.body.new_task;
  const listName = req.body.submit;
  console.log(newTodo);
  console.log(listName);
  const itemN = new Task({
    name: newTodo
  });

  if (listName === "Today") {
    itemN.save();
    console.log("Task saved successfully");
    
    res.redirect("/");
  } else {
    const findList = await List.findOne({ name: listName });
    findList.items.push(itemN);
    findList.save();
    console.log("Task saved successfully");

    res.redirect("/" + listName);
  }
});

app.post("/newList", async(req, res) => {
  const newList = req.body.newList;
  try {
    let foundList = await List.findOne({ name: newList });
  
    if (!foundList) {
      const list = new List({
        name: newList,
        items: [],
      });
      await list.save();
      console.log("New list created of title: " + list.name );
      foundList = list;
    }
    res.redirect("/"+newList)
  }
  catch(err){
    console.error(err);
  }
});


app.post("/delete", async(req, res) => {
  const checkedTaskId = req.body.task_status;
  const listDelete = req.body.listName;
  if(listDelete === "Today"){
    try{
      await Task.findByIdAndRemove(checkedTaskId);
      console.log("Task deleted successfully");
    }
    catch(err){
      console.error(err);
    };
    res.redirect('/');
  }else{
    await List.findOneAndUpdate({name: listDelete}, {$pull: {items: {_id: checkedTaskId}}});

    res.redirect("/"+listDelete);
  }
});

// app.post("/clear", (req, res) => {
//   const currentDate = req.body.currentDate;
//   // Compare currentDate with the last checked date and clear the list if different
//   // You can use a more precise date comparison logic here
//   if (currentDate !== lastCheckedDate) {
//     todoList = [];
//     lastCheckedDate = currentDate;
//     res.send("cleared");
//   } else {
//     res.send("not cleared");
//   }
// });

app.listen(3000, () => {
  console.log("Server started at port number 3000");
});
