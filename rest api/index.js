document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

async function fetchPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '<p class="loading">Loading posts...</p>';
    try {
        const [postsResponse, usersResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/users')
        ]);

        const posts = await postsResponse.json();
        const users = await usersResponse.json();
        const usersMap = users.reduce((map, user) => {
            map[user.id] = user;
            return map;
        }, {});

        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2 onclick="fetchPostDetails(${post.id})">${post.title}</h2>
                <p>${post.body}</p>
                <div class="user-info">
                    <p>Posted by: ${usersMap[post.userId].name} (${usersMap[post.userId].email})</p>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        postsContainer.innerHTML = '<p class="error">Error fetching posts. Please try again later.</p>';
        console.error('Error fetching posts:', error);
    }
}

async function fetchPostDetails(postId) {
    const postElement = document.querySelector(`#post-${postId}`);
    if (postElement) return;  // Prevent re-fetching if already fetched

    const post = document.querySelector(`h2[onclick="fetchPostDetails(${postId})"]`).parentElement;
    const commentsContainer = document.createElement('div');
    commentsContainer.classList.add('comments');
    commentsContainer.innerHTML = '<p class="loading">Loading comments...</p>';
    post.appendChild(commentsContainer);

    try {
        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const comments = await commentsResponse.json();

        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.name}</strong> (${comment.email}): ${comment.body}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        commentsContainer.innerHTML = '<p class="error">Error fetching comments. Please try again later.</p>';
        console.error('Error fetching comments:', error);
    }
}
