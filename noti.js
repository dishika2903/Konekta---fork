// Find all Accept and Decline buttons inside Requests section
document.querySelectorAll('.mb-8:nth-of-type(2) .flex.gap-2 button').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      // Get main container of the request (the 'flex items-center justify-between')
      const requestContainer = e.target.closest('.flex.items-center.justify-between');
      // Determine action
      const action = btn.textContent.trim();
  
      // Create info text
      let info = document.createElement('span');
      info.style.color = "#fff";
      info.style.marginLeft = "1rem";
      info.textContent = action === 'Accept' ? 'Request accepted!' : 'Request declined!';
      
      // Hide buttons after action
      const buttons = requestContainer.querySelector('.flex.gap-2');
      if (buttons) {
        buttons.style.display = 'none';
        requestContainer.appendChild(info);
      } else {
        // For second set of buttons (Meera), structure is different
        requestContainer.querySelectorAll('button').forEach(b => b.style.display = 'none');
        requestContainer.appendChild(info);
      }
  
      // Optionally, fade out or remove after a few seconds
      setTimeout(() => {
        requestContainer.style.opacity = '0.5';
        info.style.fontWeight = "bold";
      }, 800);
      setTimeout(() => {
        requestContainer.style.display = 'none';
      }, 2200);
    });
  });
  