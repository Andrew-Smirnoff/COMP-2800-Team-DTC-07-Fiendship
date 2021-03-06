function display_stories(){
    /**
     * displays all stories for voting with buttons to select which one
     */
    let story_array = []
    let form_selections = $("form")
    db.collection('rooms').doc(sessionStorage.getItem('room')).get().then(function(snap){
        story_array = snap.data()['stories'];
    }).then(function(){
        for(i = 0; i < story_array.length; i++){
            if(story_array[i]['name'] != sessionStorage.getItem('name')){
                let new_label = document.createElement('label')
                let new_input = document.createElement('input')
                new_input.setAttribute('type', 'radio')
                new_input.setAttribute('name', 'vote')
                new_input.setAttribute('id', story_array[i]['story'])
                new_input.setAttribute('value', story_array[i]['name'])
                new_label.setAttribute('for', story_array[i]['story'])
                new_label.innerHTML = story_array[i]['story']
                form_selections.append(new_label)
                form_selections.append(new_input)
            }
        }
    })
}

function getCurrentBackgroundPic() {
    /**
     * places current background picture
     */
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
}
getCurrentBackgroundPic();

function main(){
    getCurrentBackgroundPic();
    display_stories()
    $('#submit').click(function(){
        $('input:checked').each(function () {
            let vote = this.value;
            db.runTransaction((transaction) => {
                return transaction.get(db.collection('rooms').doc(sessionStorage.getItem('room'))).then(function(snap){
                    let stories = snap.data()['stories']
                    let vote_count = snap.data()['votes']
                    vote_count++;
                    for(i = 0; i < stories.length; i++){
                        if(stories[i]['name'] == vote){
                            stories[i]['points'] ++;
                            stories[i]['current_points'] ++;
                            transaction.update(db.collection('rooms').doc(sessionStorage.getItem('room')), {stories: stories, votes: vote_count, rounds: snap.data()['rounds'] - 1})
                        }
                    }
                })
            }).then(function(){
                document.location.href = "./vote_waiting.html";
            })
        });
    })
}

main();