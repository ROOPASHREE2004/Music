const audio = document.getElementById('audio');
const songsContainer = document.getElementById('songsContainer');
const playlistContainer = document.getElementById('playlistContainer');

const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const progress = document.getElementById('progress');
const playBtn = document.getElementById('playBtn');

let flatSongs = [];
let index = 0;
let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

/* RENDER MUSIC (GENRES) */
function renderMusic(){
    songsContainer.innerHTML = "";
    flatSongs = [];

    musicData.forEach(section => {

        let h2 = document.createElement('h2');
        h2.innerText = section.genre;
        songsContainer.appendChild(h2);

        let row = document.createElement('div');
        row.className = "row";

        section.songs.forEach(song => {

            flatSongs.push(song);

            let div = document.createElement('div');
            div.className = "card";

            div.innerHTML = `
                <img src="${song.cover}">
                <p>${song.name}</p>
            `;

            div.onclick = ()=>{
                index = flatSongs.indexOf(song);
                loadSong(index);
            }

            row.appendChild(div);
        });

        songsContainer.appendChild(row);
    });
}

/* LOAD SONG */
function loadSong(i){
    let song = flatSongs[i];

    audio.src = song.path;
    title.innerText = song.name;
    artist.innerText = song.artist;
    cover.src = song.cover;

    audio.play();
    playBtn.className = "fas fa-pause";
}

/* CONTROLS */
function togglePlay(){
    if(audio.paused){
        audio.play();
        playBtn.className = "fas fa-pause";
    } else {
        audio.pause();
        playBtn.className = "fas fa-play";
    }
}

function next(){
    index = (index + 1) % flatSongs.length;
    loadSong(index);
}

function prev(){
    index = (index - 1 + flatSongs.length) % flatSongs.length;
    loadSong(index);
}

/* PROGRESS */
audio.ontimeupdate = ()=>{
    progress.value = (audio.currentTime / audio.duration) * 100;
}

progress.oninput = ()=>{
    audio.currentTime = (progress.value / 100) * audio.duration;
}

/* SEARCH */
document.getElementById('search').oninput = (e)=>{
    let value = e.target.value.toLowerCase();

    document.querySelectorAll('.card').forEach(card=>{
        card.style.display =
            card.innerText.toLowerCase().includes(value)
            ? "block" : "none";
    });
}

/* PLAYLIST */
function renderPlaylist(){
    playlistContainer.innerHTML = "";

    playlist.forEach(song=>{
        let div = document.createElement('div');
        div.innerText = song.name;

        div.onclick = ()=>{
            index = flatSongs.findIndex(s => s.name === song.name);
            loadSong(index);
        }

        playlistContainer.appendChild(div);
    });

    localStorage.setItem("playlist", JSON.stringify(playlist));
}

/* INIT */
renderMusic();
renderPlaylist();