const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const main = async () => {
  while (1 > 0) {
    await sleep(2000)
    db.collection("rooms").doc(sessionStorage.getItem('room')).get().then(function (snap) {
      let votes = snap.data()['votes']
      if (votes == snap.data()['players'].length) {
        if (Math.floor(snap.data()['rounds'] / snap.data()['players'].length) == 0) {
          document.location.href = "./winner.html";
        } else {
          document.location.href = "./results.html";
        }
      }
      next_page = true;
    })
  }
}

function getCurrentBackgroundPic() {
  let document_id = sessionStorage.getItem('document_id');
  var docRef = db.collection('users').doc(document_id);
  docRef.get().then((doc) => {
      if (doc.exists) {
          console.log('[user current background pic] ', doc.data().current_bg_pic);
          let user_current_bg_pic = doc.data().current_bg_pic;
          $('body').css('background-image', "url('" + user_current_bg_pic + "')");
      } else {
          console.log('no such document')
      }
  }).catch((error)=> {
      console.log('Error getting document: ', error)
  })
} getCurrentBackgroundPic();

main()