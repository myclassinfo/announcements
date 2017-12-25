firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      // window.location.href = 'index.html';
      // window.location.replace("index.html");
      $('.delete-button').removeClass('hide');
      $('.signIn').addClass('hide');
      $('.signOut').removeClass('hide');
      $('#signInModal').modal('close');
       var user = firebase.auth().currentUser;
       if(user.uid == 'C7WLwOKq9ufefZ8s6Ol0MMmsrV32'){ $('#createNewPost').removeClass('hide'); }
      
    // if (user != null) {
    //   user.providerData.forEach(function (profile) {
    //     console.log("Sign-in provider: " + profile.providerId);
    //     console.log("  Provider-specific UID: " + profile.uid);
    //     console.log("  Name: " + profile.displayName);
    //     console.log("  Email: " + profile.email);
    //     console.log("  Photo URL: " + profile.photoURL);
    //     console.log(user.uid);
    //   });
    // }
      
    } else {
      // No user is signed in.
      
    }
});

var db = firebase.firestore();
var storage = firebase.storage();

var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth();
var curr_year = d.getFullYear();
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var n = month[d.getMonth()];
var due_date_day = curr_date + 2;
var datenow = curr_date + "-" + n + "-" + curr_year;

$(document).on('click', '#signInButton', function (event) {
  event.preventDefault();

  var email = $("#signInUsername").val();
  var password = $("#signInPassword").val();

    if(email != "" && password != ""){

      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
		Materialize.toast('Oh Bollocks! Invalid Username or Password. Please try again.', 3000);
      })

    }
});

$(".signOut").click(function(){
    firebase.auth().signOut().then(function() {
      $('#createNewPost').addClass('hide');
      $('.delete-button').addClass('hide');
      $('.signIn').removeClass('hide');
      $('.signOut').addClass('hide');
    }).catch(function(error) {
      alert(error.message);
    });
});

$(document).on('click', '#deletePostBtn', function (event) {
	event.preventDefault();
	var post_id = $('#modal_post_id').html();
	db.collection("posts").doc(post_id).delete().then(function() {
		Materialize.toast('Brilliant! Your announcement has been deleted.', 3000);
	}).catch(function(error) {
		Materialize.toast('Oh Bollocks! An error occured.', 3000);
	});
	    $('#modal1').modal('close');
});
$(document).on('click', '.modal-trigger', function (event) {
	var key = $(this).attr("key");
	$('#modal_post_id').html(key);
});

$(document).on('click', '#postAnnouncementButton', function (event) {
	event.preventDefault();
	var myFile = $('#imgInp').prop('files');
	var img = '';
	var imgUrl;
	var post_type = 'post';
	if(myFile.length === 0){ }else{ img = myFile[0].name; post_type = 'photo'; }
	var post = $('#textarea1').val();
	if(post === ''){ $('#textarea1').focus(); return; };

	if(img !== ''){
		var storageRef = storage.ref('posts/' + myFile[0].name);
			var uploadTask = storageRef.put(myFile[0]);
			uploadTask.on('state_changed', function(snapshot){
			  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			  switch (snapshot.state) {
			    case firebase.storage.TaskState.PAUSED: // or 'paused'
			      break;
			    case firebase.storage.TaskState.RUNNING: // or 'running'
			      break;
			  }
			}, function(error) {
				console.log(error);
			}, function() {
			    var downloadURL = uploadTask.snapshot.downloadURL;
				db.collection("posts").add({
				    post : post,
				    date_posted: datenow,
				    img: img,
				    post_type: post_type,
				    url: downloadURL,
				})
				.then(function(docRef) {
				    var x = db.collection("posts").doc(docRef.id);
				    var timestamp = firebase.firestore.FieldValue.serverTimestamp();
				    x.update({ post_id: docRef.id, addedAt: timestamp });
					Materialize.toast('Brilliant! Your announcement has been posted.', 3000);
				})
				.catch(function(error) {
					Materialize.toast('Oh Bollocks! An error occured.', 3000);
				});	
			});
	}else{
		db.collection("posts").add({
		    post : post,
		    date_posted: datenow,
		    post_type: post_type,
		})
		.then(function(docRef) {
		    var x = db.collection("posts").doc(docRef.id);
		    var timestamp = firebase.firestore.FieldValue.serverTimestamp();
		    x.update({ post_id: docRef.id, addedAt: timestamp });	
			Materialize.toast('Brilliant! Your announcement has been posted.', 3000);
		})
		.catch(function(error) {
			Materialize.toast('Oh Bollocks! An error occured.', 3000);
		});
	}

	$('#newPost')[0].reset();
	$('.img-wrap').addClass('hide'); $('#imgToUpload').removeAttr('src');
});

function getPosts(){
	db.collection("posts").orderBy("addedAt", "asc")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges.forEach(function(change) {
            if (change.type === "added") {
            	var currentPost;

            	currentPost = document.createElement('ul');
            	$(currentPost).addClass('collection');
            	$(currentPost).attr('id', change.doc.data().post_id);
            	$('#postsContainer').prepend(currentPost);
            	var li = document.createElement('li');
            	$(li).addClass('collection-item');

            	$(currentPost).append(li);

            	var valignwrapper = document.createElement('div');
            	$(valignwrapper).addClass('row');
            	$(valignwrapper).addClass('valign-wrapper');

            	$(li).append(valignwrapper);

            	var col = document.createElement('div');
            	$(col).addClass('col');
            	$(col).addClass('s2');

            	$(valignwrapper).append(col);

            	var avatar = document.createElement('img');
            	avatar.src = 'assets/img/avatar/default.png';
            	$(avatar).addClass('circle');
            	$(avatar).addClass('responsive-img');
            	avatar.height = '20px';

            	$(col).append(avatar);

            	var cols9 = document.createElement('div');
            	$(cols9).addClass('col');
            	$(cols9).addClass('s9');

            	$(valignwrapper).append(cols9);

            	var spanBlackText = document.createElement('span');
            	$(spanBlackText).addClass('black-text');
            	
            	$(cols9).append(spanBlackText);

            	var spanGreyText = document.createElement('span');
            	$(spanGreyText).addClass('grey-text');

            	$(spanBlackText).append(spanGreyText);

            	$(spanGreyText).append('<strong><a href="#">Informatics Administrator</a></strong> added a new ' + change.doc.data().post_type + '<br><sub>' 
            							+ change.doc.data().date_posted + '</sub>' );

            	var cols1 = document.createElement('div');
            	$(cols1).addClass('col');
            	$(cols1).addClass('s1');

            	$(valignwrapper).append(cols1);

            	var dropdown = document.createElement('a');
            	dropdown.href = "#modal1";
            	$(dropdown).addClass('modal-trigger');
            	$(dropdown).addClass('delete-button');
            	// $(dropdown).addClass('hide');
            	$(dropdown).attr("key", change.doc.data().post_id);

            	firebase.auth().onAuthStateChanged(function(user) {
    			if (user) {
    				var user = firebase.auth().currentUser;
    				if (user.uid == 'C7WLwOKq9ufefZ8s6Ol0MMmsrV32') {
            			$(cols1).append(dropdown);
            		}
            	}});

            	var dropdownIcon = document.createElement('i');
            	$(dropdownIcon).addClass('material-icons');
            	$(dropdownIcon).addClass('tiny');
            	$(dropdownIcon).html('close');

            	$(dropdown).append(dropdownIcon);

            	$('.modal').modal();

            	var post_data = document.createElement('p');
            	$(post_data).html(change.doc.data().post);
            	$(li).append(post_data);

            	if(change.doc.data().post_type === 'photo'){
            		var post_img = document.createElement('img');
            		$(post_img).addClass('responsive-img');
            		$(post_img).addClass('materialboxed');
            		post_img.src = change.doc.data().url;
            		$(li).append(post_img);
            		$('.materialboxed').materialbox();
            	}

            	// console.log("New record: ", change.doc.data());
            	
            }
            if (change.type === "modified") {
                // console.log("Modified record: ", change.doc.data());
            }
            if (change.type === "removed") {
            	$('ul#' + change.doc.data().post_id).remove();
            	var storageRef = storage.ref('posts/');
            	var deleteImg = storageRef.child(change.doc.data().img);
				deleteImg.delete().then(function() {
				}).catch(function(error) { });
                // console.log("Removed record: ", change.doc.data());
            }
        });
    });

}

getPosts();
