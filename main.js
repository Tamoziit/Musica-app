const othersList = document.getElementById('othersList');
const search = document.getElementById("search");
const searchBTN = document.getElementById("searchBTN");
const likesList = document.getElementById("likesList");
const banner = document.querySelectorAll('h3');
const commentModal = document.querySelector(".commentModal");
const notesModal = document.querySelector(".notesModal");
const notesList = document.querySelector(".notesList");
const audioContainer = document.querySelector(".audioContainer");
const audioPlayer = document.querySelector(".audioContainer .audioPlayer");
const songPause = document.getElementById("songPause");
const audioImg = document.querySelector(".audioContainer .audioImg");
const T1 = document.querySelector(".audioContainer #Details #T1");
const T2 = document.querySelector(".audioContainer #Details #T2");
const circle = document.querySelector(".audioContainer .playbar .seekbar .circle");
const seekbar = document.querySelector(".audioContainer .playbar .seekbar");
const volume = document.getElementById("volume");
const top4 = document.querySelector(".mostPopular .top4")



const headings = ['One stop for Music Reviews and Top Songs', 'Build your own personalized playlist', 'View latest & trending tracks', 'Write your track reviews'];
let index = 0;

setInterval(() => {
	banner[index].style.opacity = 0;
	index = (index + 1) % headings.length;
	banner[index].style.opacity = 1;
}, 3000);

if (typeof localStorage !== 'undefined') {
	fetchPlaylist();
}

if (typeof localStorage !== 'undefined') {
	recommendations();
}

if (typeof localStorage !== 'undefined') {
	displayTop4();
}




async function recommendations() {
	const trackIds = getSongFromLS();
	const tracks = [];
	for (let i = 0; i < trackIds.length; i++) {
		const trackId = trackIds[i];
		let song = await getSongById(trackId);
		tracks.push(song.trackName);
	}
	if (tracks.length !== 0) {
		for (let j = 0; j < tracks.length; j++) {
			const url = 'https://itunes.apple.com/search?term=' + tracks[j];
			fetch(url)
				.then((res) => res.json())
				.then((data) => {
					const artists = data.results;
					console.log(artists);
					return artists.forEach((result) => {
						const othersContainer = document.createElement('div');
						othersContainer.classList.add("othersContainer");
						othersContainer.innerHTML = `
		<div id="DetailsContainer">
                            <img src=${result.artworkUrl100}>
                            <div id="Details">
                                <text id="T1">${result.trackName}</text>
                                <text id="T2">${result.artistName}</text>
                            </div>
                        </div>`;

						const action = document.createElement('div');
						action.classList.add("action");
						const trackIds = getSongFromLS();
						const alreadyHasTrack = trackIds.includes(result.trackId);
						if (!alreadyHasTrack) {
							action.innerHTML = `
			<button class="searchLikes" id=${result.trackId}>
							    <i class="fa-regular fa-heart"></i>
							</button>
                            <button class="searchComments" id="searchCommentsBtn">
								<i class="fa-regular fa-comment"></i>
							</button>
							<button class="viewNotes" id=${result.trackId}>
								<i class="fa-regular fa-eye"></i>
							</button>
                        `;
						}
						else {
							action.innerHTML = `<button class="searchLikes" id=${result.trackId}>
							    <i class="fa-solid fa-heart"></i>
							</button>
                            <button class="searchComments" id="searchCommentsBtn">
								<i class="fa-regular fa-comment"></i>
							</button>
							<button class="viewNotes" id=${result.trackId}>
								<i class="fa-regular fa-eye"></i>
							</button>
                        `;
						}

						othersContainer.addEventListener("click", () => {
							audioFunc(result.trackId);
						});


						othersContainer.appendChild(action);
						othersList.appendChild(othersContainer);

						const likeBtn = othersContainer.querySelector(".action .searchLikes");
						const btn = document.getElementById(result.trackId)
						likeBtn.addEventListener("click", () => {
							if (likeBtn.classList.contains("active")) {
								removeSongFromLS(result.trackId);
								likeBtn.classList.remove("active");
								btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;

							}
							else {
								addSongToLS(result.trackId);
								fetchPlaylist();
								likeBtn.classList.toggle("active");
								btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
							}
						})
						const searchCommentsBtn = othersContainer.querySelector(".action .searchComments");
						searchCommentsBtn.addEventListener("click", () => {
							showCommentModal(result.trackId);
							commentModal.scrollIntoView({ behavior: 'smooth' });
						});

						const close = document.getElementById("close");
						close.addEventListener("click", () => {
							closeCommentModal();
						});

						const viewNotes = othersContainer.querySelector(".action .viewNotes");
						viewNotes.addEventListener("click", () => {
							showNotesModal(result.trackId);
							notesModal.scrollIntoView({ behavior: 'smooth' });
						});

						const closebtn = document.getElementById("closeBtn");
						closebtn.addEventListener("click", () => {
							closeNotesModal();
						});
					})
				})
				.catch(error => console.log("Failed Request:", error))
		}
	}
	else {
		const url = 'https://itunes.apple.com/search?term=satranga';
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				const artists = data.results;
				console.log(artists);
				return artists.forEach((result) => {
					const othersContainer = document.createElement('div');
					othersContainer.classList.add("othersContainer");
					othersContainer.innerHTML = `
		<div id="DetailsContainer">
                            <img src=${result.artworkUrl100}>
                            <div id="Details">
                                <text id="T1">${result.trackName}</text>
                                <text id="T2">${result.artistName}</text>
                            </div>
                        </div>`;

					const action = document.createElement('div');
					action.classList.add("action");
					const trackIds = getSongFromLS();
					const alreadyHasTrack = trackIds.includes(result.trackId);
					if (!alreadyHasTrack) {
						action.innerHTML = `
			<button class="searchLikes" id=${result.trackId}>
							    <i class="fa-regular fa-heart"></i>
							</button>
                            <button class="searchComments" id="searchCommentsBtn">
								<i class="fa-regular fa-comment"></i>
							</button>
							<button class="viewNotes" id=${result.trackId}>
								<i class="fa-regular fa-eye"></i>
							</button>
                        `;
					}
					else {
						action.innerHTML = `<button class="searchLikes" id=${result.trackId}>
							    <i class="fa-solid fa-heart"></i>
							</button>
                            <button class="searchComments" id="searchCommentsBtn">
								<i class="fa-regular fa-comment"></i>
							</button>
							<button class="viewNotes" id=${result.trackId}>
								<i class="fa-regular fa-eye"></i>
							</button>
                        `;
					}

					othersContainer.addEventListener("click", () => {
						audioFunc(result.trackId);
					});

					othersContainer.appendChild(action);
					othersList.appendChild(othersContainer);

					const likeBtn = othersContainer.querySelector(".action .searchLikes");
					const btn = document.getElementById(result.trackId)
					likeBtn.addEventListener("click", () => {
						if (likeBtn.classList.contains("active")) {
							removeSongFromLS(result.trackId);
							likeBtn.classList.remove("active");
							btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;

						}
						else {
							addSongToLS(result.trackId);
							fetchPlaylist();
							likeBtn.classList.toggle("active");
							btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
						}
					})
					const searchCommentsBtn = othersContainer.querySelector(".action .searchComments");
					searchCommentsBtn.addEventListener("click", () => {
						showCommentModal(result.trackId);
						commentModal.scrollIntoView({ behavior: 'smooth' });
					});

					const close = document.getElementById("close");
					close.addEventListener("click", () => {
						closeCommentModal();
					});

					const viewNotes = othersContainer.querySelector(".action .viewNotes");
					viewNotes.addEventListener("click", () => {
						showNotesModal(result.trackId);
						notesModal.scrollIntoView({ behavior: 'smooth' });
					});

					const closebtn = document.getElementById("closeBtn");
					closebtn.addEventListener("click", () => {
						closeNotesModal();
					});
				})
			})
			.catch(error => console.log("Failed Request:", error))
	}

}

const searchSong = () => {
	othersList.innerHTML = ``;
	let term = search.value;
	console.log(term);
	if (!term || term === '') {
		alert("Please enter song to be searched");
	}
	else {
		const url = 'https://itunes.apple.com/search?term=' + term;
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				const artists = data.results;

				return artists.forEach((result) => {
					const othersContainer = document.createElement('div');
					othersContainer.classList.add("othersContainer");
					othersContainer.innerHTML = `
		                <div id="DetailsContainer">
                            <img src=${result.artworkUrl100}>
                            <div id="Details">
                                <text id="T1">${result.trackName}</text>
                                <text id="T2">${result.artistName}</text>
                            </div>
                        </div>`;

					const action = document.createElement('div');
					action.classList.add("action");
					const trackIds = getSongFromLS();
					const alreadyHasTrack = trackIds.includes(result.trackId);
					if (!alreadyHasTrack) {
						action.innerHTML = `
				<button class="searchLikes" id=${result.trackId}>
					<i class="fa-regular fa-heart"></i>
				</button>
				<button class="searchComments" id="searchCommentsBtn">
					<i class="fa-regular fa-comment"></i>
				</button>
				<button class="viewNotes" id=${result.trackId}>
					<i class="fa-solid fa-eye"></i>
				</button>
				`;
					}
					else {
						action.innerHTML = `
			    <button class="searchLikes" id=${result.trackId}>
					<i class="fa-solid fa-heart"></i>
				</button>
				<button class="searchComments" id="searchCommentsBtn">
					<i class="fa-regular fa-comment"></i>
				</button>
				<button class="viewNotes" id=${result.trackId}>
					<i class="fa-solid fa-eye"></i>
				</button>
				`;
					}

					othersContainer.addEventListener("click", () => {
						audioFunc(result.trackId);
					});

					othersContainer.appendChild(action);
					othersList.appendChild(othersContainer);

					const likeBtn = othersContainer.querySelector(".action .searchLikes");
					const btn = document.getElementById(result.trackId)
					likeBtn.addEventListener("click", () => {
						if (likeBtn.classList.contains("active")) {
							removeSongFromLS(result.trackId);
							likeBtn.classList.remove("active");
							btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
						}
						else {
							addSongToLS(result.trackId);
							fetchPlaylist();
							likeBtn.classList.toggle("active");
							btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
						}
					})
					const searchCommentsBtn = othersContainer.querySelector(".action .searchComments");
					searchCommentsBtn.addEventListener("click", () => {
						showCommentModal(result.trackId);
						commentModal.scrollIntoView({ behavior: 'smooth' });
					});

					const close = document.getElementById("close");
					close.addEventListener("click", () => {
						closeCommentModal();
					});

					const viewNotes = othersContainer.querySelector(".action .viewNotes");
					viewNotes.addEventListener("click", () => {
						showNotesModal(result.trackId);
						notesModal.scrollIntoView({ behavior: 'smooth' });
					});

					const closebtn = document.getElementById("closeBtn");
					closebtn.addEventListener("click", () => {
						closeNotesModal();
					});
				})
			})
			.catch(error => console.log("Failed Request:", error))

	}
	othersList.scrollIntoView({ behavior: 'smooth' });
}

searchBTN.addEventListener('click', searchSong);

async function getSongById(trackId) {
	const res = await fetch('https://itunes.apple.com/search?term=' + trackId);
	const resData = await res.json();
	const song = resData.results[0];
	return song;
}

function removeSongFromLS(trackId) {
	const trackIds = getSongFromLS();
	localStorage.setItem('trackIds', JSON.stringify(trackIds.filter((id) => id !== trackId)));
	recommendations();
}

function addSongToLS(trackId) {
	const trackIds = getSongFromLS();
	const alreadyHasTrack = trackIds.includes(trackId);
	if (!alreadyHasTrack) {
		localStorage.setItem('trackIds', JSON.stringify([...trackIds, trackId]));
	}
	else {
		alert("You already have this song in your Playlist");
	}
}

function getSongFromLS() {
	const trackIds = JSON.parse(localStorage.getItem('trackIds'));
	return trackIds === null ? [] : trackIds; //checking if mealId is not null
}

async function fetchPlaylist() {
	//cleaning the fav-container before reload, to avoid display of duplicate elements after reloading
	if (typeof localStorage !== 'undefined') {
		likesList.innerHTML = ``;

		const trackIds = getSongFromLS();
		for (let i = trackIds.length - 1; i >= 0; i--) {
			const trackId = trackIds[i];
			let song = await getSongById(trackId);
			addSongToFav(song);
		}
	}
}

function addSongToFav(song) {
	const playList = document.createElement('div');
	playList.classList.add('playList');
	playList.innerHTML = `
                    <div class="likeDetails">
                        <img src=${song.artworkUrl100}>
                        <div class="Details">
                            <text class="T1">${song.trackName}</text>
                            <text class="T2">${song.artistName}</text>
                        </div>
                    </div>
                    
                    <div class="icon">
					    <button class="playlistLikes" id=${song.trackId}>
							<i class="fa-solid fa-heart"></i>
				        </button>
                    </div>
                `;
	likesList.appendChild(playList);

	playList.addEventListener("click", () => {
		audioFunc(song.trackId);
	});

	const btn = document.getElementById(song.trackId);
	btn.addEventListener("click", () => {
		removeSongFromLS(song.trackId);
		fetchPlaylist();
	})
}

//commentModal
function showCommentModal(trackId) {
	document.querySelector(".commentModal").classList.add("showCommentModal");
	enterData(trackId);
}

function closeCommentModal() {
	document.querySelector(".commentModal").classList.remove("showCommentModal");
}

//Practice Notes
function showNotesModal(trackId) {
	document.querySelector(".notesModal").classList.add("showNotesModal");
	getNotes(trackId);
}

function closeNotesModal() {
	document.querySelector(".notesModal").classList.remove("showNotesModal");
}

function enterData(trackId) {
	const header = document.getElementById("header");
	const notes = document.getElementById("notes");
	const submitBtn = document.getElementById("submit");
	submitBtn.addEventListener("click", () => {
		setTrackData(trackId, header.value, notes.value);
	});
}

function setTrackData(trackId, header, description) {
	const trackData = { header, description };
	let trackDataArray = JSON.parse(localStorage.getItem(trackId)) || [];
	trackDataArray.push(trackData);
	localStorage.setItem(trackId, JSON.stringify(trackDataArray));
	alert("Note added successfully!");
}

function getNotes(trackId) {
	notesList.innerHTML = ``;
	const trackDataArray = JSON.parse(localStorage.getItem(trackId));
	if (trackDataArray) {
		trackDataArray.map((trackData) => {
			const notesContainer = document.createElement('div');
			notesContainer.classList.add("notesContainer");
			notesContainer.innerHTML = `
			<h4>${trackData.header}</h4>
			<p class="text">${trackData.description}</p>`;

			notesList.appendChild(notesContainer);
		});
		notesModal.appendChild(notesList);
	}
}

async function audioFunc(songId) {
	audioPlayer.innerHTML = ``;
	const res = await fetch(`https://itunes.apple.com/lookup?id=${songId}`);
	const resData = await res.json();
	const song = resData.results[0];
	addPlayedTrackToLS(song.trackId);
	const audio = document.createElement("audio");
	const source = document.createElement("source");
	source.src = song.previewUrl;
	audio.play();
	audio.controls = true;
	audio.appendChild(source);
	audioPlayer.appendChild(audio);
	audioImg.src = song.artworkUrl100;
	T1.innerText = song.trackName;
	T2.innerText = song.artistName;

	audio.addEventListener("timeupdate", () => {
		circle.style.left = (audio.currentTime / audio.duration) * 100 + "%";
	});
	seekbar.addEventListener("click", e => {
		let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
		circle.style.left = percent + "%";
		audio.curerntTime = ((audio.duration) * percent) / 100;
	});
	volume.addEventListener("change", (e) => {
		audio.volume = parseInt(e.target.value) / 100;
	});
	songPause.innerHTML = `<i class="fa-solid fa-pause"></i>`;
	songPause.classList.toggle("active");
	songPause.addEventListener("click", event => {
		const audio = document.getElementsByTagName('audio');
		if (songPause.classList.contains("active")) {
			songPause.classList.remove("active");
			songPause.innerHTML = `<i class="fa-solid fa-play"></i>`;
			for (let i = 0; i < audio.length; i++) {
				if (audio[i] != event.target) {
					audio[i].pause();
				}
			}
		}
		else {
			songPause.classList.toggle("active");
			songPause.innerHTML = `<i class="fa-solid fa-pause"></i>`;
			for (let i = 0; i < audio.length; i++) {
				if (audio[i] != event.target) {
					audio[i].play();
				}
			}
		}
	}, true);
}

function addPlayedTrackToLS(trackId) {
	// Check if localStorage is supported
	if (typeof (Storage) !== "undefined") {
		// Retrieve existing playTimes data from localStorage
		let playTimes = JSON.parse(localStorage.getItem('playTimes')) || {};

		// Check if the trackId exists in the playTimes object
		if (playTimes.hasOwnProperty(trackId)) {
			// If the trackId exists, increment the timesPlayed count
			playTimes[trackId].timesPlayed++;
		} else {
			// If the trackId doesn't exist, add it to the playTimes object
			playTimes[trackId] = {
				trackId: trackId,
				timesPlayed: 1
			};
		}

		localStorage.setItem('playTimes', JSON.stringify(playTimes));
	} else {
		alert("LocalStorage is not supported in this browser.");
	}
}

function getTopPlayedTracks() {
	// Check if localStorage is supported
	if (typeof (Storage) !== "undefined") {
		// Retrieve existing playTimes data from localStorage
		let playTimes = JSON.parse(localStorage.getItem('playTimes')) || {};

		// Convert playTimes object to an array of track objects
		let trackArray = Object.values(playTimes);

		// Sort trackArray based on timesPlayed in descending order
		trackArray.sort((a, b) => b.timesPlayed - a.timesPlayed);

		// Return the top 4 played tracks
		return trackArray.slice(0, 4);
	} else {
		alert("LocalStorage is not supported in this browser.");
		return [];
	}
}

async function displayTop4() {
	let topTracks = getTopPlayedTracks();

	for (let i = 0; i < topTracks.length; i++) {
		let trackId = topTracks[i].trackId;
		const song = await getSongById(trackId);
		const topContainer = document.createElement("div");
		topContainer.classList.add("topContainer");
		topContainer.innerHTML = `<img src=${song.artworkUrl100}>
		<div class="Details">
			<text class="T1">${song.trackName}</text>
			<text class="T2">${song.artistName}</text>
		</div>`;

		const action = document.createElement('div');
		action.classList.add("action");
		const trackIds = getSongFromLS();
		const alreadyHasTrack = trackIds.includes(song.trackId);
		if (!alreadyHasTrack) {
			action.innerHTML = `
				<button class="searchLikes" id=${song.trackId}>
					<i class="fa-regular fa-heart"></i>
				</button>
				<button class="searchComments" id="searchCommentsBtn">
					<i class="fa-regular fa-comment"></i>
				</button>
				<button class="viewNotes" id=${song.trackId}>
					<i class="fa-solid fa-eye"></i>
				</button>
				`;
		}
		else {
			action.innerHTML = `
			    <button class="searchLikes" id=${song.trackId}>
					<i class="fa-solid fa-heart"></i>
				</button>
				<button class="searchComments" id="searchCommentsBtn">
					<i class="fa-regular fa-comment"></i>
				</button>
				<button class="viewNotes" id=${song.trackId}>
					<i class="fa-solid fa-eye"></i>
				</button>
				`;
		}

		topContainer.addEventListener("click", () => {
			audioFunc(song.trackId);
		});

		topContainer.appendChild(action);
		top4.appendChild(topContainer);

		const likeBtn = topContainer.querySelector(".action .searchLikes");
		const btn = document.getElementById(song.trackId)
		likeBtn.addEventListener("click", () => {
			if (likeBtn.classList.contains("active")) {
				removeSongFromLS(song.trackId);
				likeBtn.classList.remove("active");
				btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
			}
			else {
				addSongToLS(song.trackId);
				fetchPlaylist();
				likeBtn.classList.toggle("active");
				btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
			}
		})
		const searchCommentsBtn = topContainer.querySelector(".action .searchComments");
		searchCommentsBtn.addEventListener("click", () => {
			showCommentModal(song.trackId);
			commentModal.scrollIntoView({ behavior: 'smooth' });
		});

		const close = document.getElementById("close");
		close.addEventListener("click", () => {
			closeCommentModal();
		});

		const viewNotes = topContainer.querySelector(".action .viewNotes");
		viewNotes.addEventListener("click", () => {
			showNotesModal(song.trackId);
			notesModal.scrollIntoView({ behavior: 'smooth' });
		});

		const closebtn = document.getElementById("closeBtn");
		closebtn.addEventListener("click", () => {
			closeNotesModal();
		});

	};
}
