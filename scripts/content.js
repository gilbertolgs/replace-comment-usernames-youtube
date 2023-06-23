//Google API Key please do not use it outside of this project.
const YOUR_API_KEY = 'AIzaSyCyikvaKtBE04XpBgqxW1X9sydRm3N_Q2A'

function replaceByChannelName(addedNode) {
  //Gets the element of the channel's link
  const authorLink = addedNode.querySelector('a#author-text');
  //If the channel is verified gets the link in a different element
  const creatorLink = addedNode.querySelector('a#name');

  //Gets the channel ID by removing the characters: 'https://www.youtube.com/channel/'
  const link = authorLink || creatorLink;
  const USER_ID = link.href.slice(32);
  
  const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${USER_ID}&key=${YOUR_API_KEY}`
  fetch(url)
  .then(response => response.json())
  .then(data => {
    const channelName = data.items[0].snippet.title;
    if(creatorLink) {
      addedNode.querySelector('yt-formatted-string#text').innerText = channelName;
    }
    if(authorLink) {
      authorLink.firstElementChild.innerText = channelName;
    }
  })
  .catch(error => {
    console.error(error);
  });
}

function observeComments(element) {
  let observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      for (let addedNode of mutation.addedNodes) {
        //Removes '@' in commentor name
        if (addedNode.nodeName === "YTD-COMMENT-RENDERER") {
          replaceByChannelName(addedNode);
        }
        //if it is a comment thread calls observer for replies
        if (addedNode.nodeName === "YTD-COMMENT-THREAD-RENDERER") {
          const threadReplies = addedNode.querySelector('div#contents');

          if (threadReplies) {
            observeComments(threadReplies);
          }
          
        }
      }
    }
  });
  observer.observe(element, { childList: true, subtree: true });
}

observeComments(document);