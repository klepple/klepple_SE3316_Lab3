//script.js

//Call saveMessage when submit buttons are clicked.
document.getElementById('course1Button').onclick = function() {saveMessage(1)};
document.getElementById('course2Button').onclick = function() {saveMessage(2)};

//Create a node element helper function
function createNode(element) {
    return document.createElement(element);
}

//Append an element helper function
function append(parent, el) {
    return parent.appendChild(el);
}

//Get all the messages from the database and append them to an ordered list
function getMessages() {
    //Get ordered list
    const ol = document.getElementById("top20course1"); //courseCode.toString());
    const url = 'api/messages';
    window.fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            console.log(data);
            return data.map(function(message) {
            let li = createNode('li'),
            span = createNode('span');
            span.innerHTML = message.content;
            span.setAttribute("courseCode", 'ID: ${message._id}');
            span.setAttribute("timeStamp", 'ID: ${message._timeStamp}');
            append(li, span);
            append(ol, li);
            })
        })
        .catch(function(error) {
            console.log(JSON.stringify(error));
        });
}

//Save message entered into textarea
function saveMessage(courseCode) {
      window.fetch('/api/messages', {
      	method: 'post',
      	headers: {'Content-Type': 'application/json'},
      	body: JSON.stringify({courseCode: courseCode, content: document.getElementById('course' + courseCode.toString()).value,
      	    timeStamp: Date.now()
      	})
      })
      .then(getMessages(courseCode)); // load the new list
}
    