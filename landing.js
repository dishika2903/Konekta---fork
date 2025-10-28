const API_URL = "https://jsonplaceholder.typicode.com/posts"; // use your actual backend!

window.onload = function() {
  // Like
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const postDiv = btn.closest('[data-post-id]');
      const postId = postDiv.getAttribute('data-post-id');
      const countSpan = btn.querySelector('.like-count');
      let count = parseInt(countSpan.textContent, 10) || 0;
      const liked = btn.classList.toggle('liked');
      count += liked ? 1 : -1;
      countSpan.textContent = count;
      // Send like API (optional)
      fetch(`${API_URL}/${postId}/like`, { method: "POST" });
      btn.textContent = liked ? "❤️ Liked " : "❤️ Like ";
      btn.appendChild(countSpan);
    });
  });

  // Comment (show a form below post, not prompt)
  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const postDiv = btn.closest('[data-post-id]');
      const form = postDiv.querySelector('.comment-form');
      form.classList.toggle('hidden');
      form.querySelector('.comment-input').focus();
    });
  });

  document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = form.querySelector('.comment-input');
      const comment = input.value.trim();
      if (!comment) return;
      const postDiv = form.closest('[data-post-id]');
      const postId = postDiv.getAttribute('data-post-id');

      // Show comment below post
      const commentsDiv = postDiv.querySelector('.comments');
      const node = document.createElement('div');
      node.textContent = comment;
      node.className = "bg-gray-100 p-1 m-1 rounded";
      commentsDiv.appendChild(node);

      // Reset field & hide form
      input.value = "";
      form.classList.add('hidden');
      // Send comment API (optional)
      fetch(`${API_URL}/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: comment })
      });
    });
  });

  // Share
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const postDiv = btn.closest('[data-post-id]');
      const postId = postDiv.getAttribute('data-post-id');
      fetch(`${API_URL}/${postId}/share`, { method: "POST" });
      alert("Post shared!");
    });
  });
};