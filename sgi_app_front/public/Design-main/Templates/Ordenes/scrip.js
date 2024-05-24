//Function to remove the json player.
document.addEventListener("DOMContentLoaded", function() {

    // Load the animation using Lottie.
    var animation = bodymovin.loadAnimation({
      
      container: document.getElementById('animation'),
      renderer: 'svg', // format (Json --> Svg)
      loop: true, // Loop repetition.
      autoplay: true, // play from the start of the program.
      path: '/animation/Orders.json' // JSON animation path.
    });
  });
  