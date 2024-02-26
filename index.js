const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use("/", require("./routes/authorize"));
app.use("/", require("./routes/users"));
app.use("/", require("./routes/tasks"));
app.use("/", require("./routes/task_attachments"));
app.use("/", require("./routes/comments"));
app.use("/", require("./routes/task_assignees"));

app.use("/", require("./routes/status"));
app.use("/", require("./routes/priority"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});