webApp.factory('ImageFactory', function() {
  var imageHash = {};
  var numOfLoadedImages = {};
  var numOfAllImages = 0;
  var nodeNoImages = {};
  // gen image
  function genImage(id, marker, context, numOfImages, canvas, callback) {
    var imageObj = new Image();
    if(!marker.visible) return;
    imageObj.src = marker.src;
    imageObj.onload = function() {
      numOfLoadedImages[id] ++;
      context.font = 'bold 10pt Tahoma';
      context.drawImage(imageObj, 32 * marker.count, 0);
      context.textAlign = 'center';
      context.fillText(marker.num, 32 * marker.count + 16, 16);
      imageHash[id] = canvas.toDataURL('image/png');
      numOfLoadedImages[id] === numOfImages ? callback(true) : true;
    };
  }
  // gen list of markers
  function genMakers(numOfBug, numOfSuggestion, numOfNote, numOfQuestion) {
    var count = 0;
    var content = {};
    //
    content.bug = {};
    content.bug.visible = numOfBug > 0;
    content.bug.num = numOfBug;
    content.bug.count = numOfBug > 0 ? count ++ : count;
    content.bug.src = "images/bug.png";
    //
    content.sug = {};
    content.sug.visible = numOfSuggestion > 0;
    content.sug.num = numOfSuggestion;
    content.sug.count = numOfSuggestion > 0 ? count ++ : count;
    content.sug.src = "images/suggestion.png";
    //
    content.note = {};
    content.note.visible = numOfNote > 0;
    content.note.num = numOfNote;
    content.note.count = numOfNote > 0 ? count ++ : count;
    content.note.src = "images/note.png";
    //
    content.question = {};
    content.question.visible = numOfQuestion > 0;
    content.question.num = numOfQuestion;
    content.question.count = numOfQuestion > 0 ? count ++ : count;
    content.question.src = "images/question.png";
    content.question.numOfImages = count;
    return content;
  }
  //
  function genImages(bug, sug, note, question, id, callback) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    var content = genMakers(bug, sug, note, question);
    var numOfMarker = 0;
    numOfLoadedImages[id] = 0;
    if(content.question.numOfImages === 0) {
      nodeNoImages[id] = true;
      callback(true)
    };
    for(marker in content) {
        genImage(id, content[marker], context, content.question.numOfImages, canvas, callback);
        content[marker].visible ? numOfMarker++ : numOfMarker;
    }
    canvas.width = 32 * numOfMarker;
    canvas.height = 32;
  }
  //
  function getImageHash() {
    return imageHash;
  }
  //
  function genListImages(session, len, callback) {
    genImages(session.bugCount, session.concernCount, session.noteCount, session.questionCount, session.id, function(isFinished) {
     if(isFinished) {
       ++numOfAllImages === len ? callback(true) : true;
     }
   })
  }
  //
  function genAllImages(sessionData, callback) {
    numOfAllImages = 0;
    var len = sessionData.length;
    for(var i = 0; i < len ; i++) {
      var session = sessionData[i];
      genListImages(session, len, callback);
    }
  }
  //
  function removeImageHash() {
    imageHash = {};
  }
  //
  function getNodeNoImage() {
    return nodeNoImages;
  }
  return {
    genAllImages: genAllImages,
    getImageHash: getImageHash,
    removeImageHash: removeImageHash,
    getNodeNoImage: getNodeNoImage
  }
})
