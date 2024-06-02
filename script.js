document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetch-info');
    const postsContainer = document.getElementById('posts-container');
    const postDetails = document.getElementById('post-details');
    const postContent = document.getElementById('post-content');
    const commentsContainer = document.getElementById('comments');
    const loadingIndicator = document.getElementById('loading');
    const errorIndicator = document.getElementById('error');

    fetchButton.addEventListener('click', () => {
        fetchPosts();
    });

    function fetchPosts() {
        loadingIndicator.classList.remove('hidden');
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(posts => {
                fetch('https://jsonplaceholder.typicode.com/users')
                    .then(response => response.json())
                    .then(users => {
                        loadingIndicator.classList.add('hidden');
                        displayPosts(posts, users);
                    });
            })
            .catch(() => {
                loadingIndicator.classList.add('hidden');
                errorIndicator.classList.remove('hidden');
            });
    }

    function displayPosts(posts, users) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const user = users.find(user => user.id === post.userId);
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p><strong>Author:</strong> ${user.name} (${user.email})</p>
            `;
            postElement.addEventListener('click', () => displayPostDetails(post.id));
            postsContainer.appendChild(postElement);
        });
    }

    function displayPostDetails(postId) {
        postDetails.classList.remove('hidden');
        loadingIndicator.classList.remove('hidden');
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(response => response.json())
            .then(post => {
                fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`)
                    .then(response => response.json())
                    .then(user => {
                        postContent.innerHTML = `
                            <h2>${post.title}</h2>
                            <p>${post.body}</p>
                            <p><strong>Author:</strong> ${user.name} (${user.email})</p>
                        `;
                        fetchComments(postId);
                    });
            })
            .catch(() => {
                loadingIndicator.classList.add('hidden');
                errorIndicator.classList.remove('hidden');
            });
    }

    function fetchComments(postId) {
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            .then(response => response.json())
            .then(comments => {
                loadingIndicator.classList.add('hidden');
                displayComments(comments);
            })
            .catch(() => {
                loadingIndicator.classList.add('hidden');
                errorIndicator.classList.remove('hidden');
            });
    }

    function displayComments(comments) {
        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.name}</strong> (${comment.email})</p>
                <p>${comment.body}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }
});
