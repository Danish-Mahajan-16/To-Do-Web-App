document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll('input[name="task_status"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const listItem = this.closest("li");
      const taskText = listItem.querySelector("p");

      if (taskText) {
        taskText.classList.toggle("completed-task", this.checked);
      }
    });
  });
});


// Removing placeholder when new_task input is in focus
const newTaskInput = document.getElementById("new_task");

newTaskInput.addEventListener("focus", () => {
  // When input field is focused, clear the placeholder
  newTaskInput.placeholder = "";
});

newTaskInput.addEventListener("blur", () => {
  // When input field loses focus, restore the placeholder
  newTaskInput.placeholder = "Write a task here!";
});

let config = {
  particles: {
    number: {
      value: 550,
      density: {
        enable: true,
        value_area: 786,
      },
    },
    color: {
      value: ["#ffffff", "#FF6F91", "#F9F871", "#D65DB1"],
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 12,
      },
      image: {
        src: "",
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 1,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0,
        sync: false,
      },
    },
    size: {
      value: 2.5,
      random: true,
      anim: {
        enable: true,
        speed: 3,
        size_min: 0.3,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
      distance: 100,
      color: "#fff",
      opacity: 0.023674428,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1.3,
      direction: "top",
      random: true,
      straight: true,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: true,
        rotateX: 2082.2488,
        rotateY: 3363.6328,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 70,
        line_linked: {
          opacity: 0.25,
        },
      },
      bubble: {
        distance: 100,
        size: 5,
        duration: 8.598243,
        opacity: 0,
        speed: 3,
      },
      repulse: {
        distance: 150,
        duration: 0.8,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};

window.onload = function () {
  let clause = window.innerWidth < 768;
  config.particles.number.value = clause ? 80 : 1050;
  particlesJS("particle", config);
};

function clearListIfDateChanged() {
  const currentDate = new Date().toDateString();

  $.ajax({
    url: "/clear", // This route should be implemented on the server to clear the list
    method: "POST",
    data: { currentDate },
    success: function (response) {
      if (response === "cleared") {
        location.reload(); // Reload the page to reflect the cleared list
      }
    },
  });
}

// Check the date every hour and clear the list if it has changed
setInterval(clearListIfDateChanged, 10000); // 3600000 ms = 1 hour; 24 hours = 86400000ms;
