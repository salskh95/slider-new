document.addEventListener("DOMContentLoaded", function() {
const slidesContainer = document.querySelector(".slides-container");
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");
const carousel = document.querySelector(".carousel");
let carouselItems = document.querySelectorAll(".carousel-item");
let slideIndex = 0;
let slides = slidesContainer.querySelectorAll("div");
let activeSlide = slides[slideIndex];
let isTransitioning = false;
let currentIndex = 0;
let intervalId;


fetch('/images').then(res => res.json()).then(data =>{
  const sliderImages = data.h3;
  const carouselImages = data.creatures;
  populateSlider(sliderImages);
  populateCarousel(carouselImages);
  console.log('data');
  
  
}).catch(err => {
  console.log('Error fetching images:', err);
  
})

nextButton.addEventListener("click", moveNext);
prevButton.addEventListener("click", movePrevious);

function populateSlider(images){
  const slidesContainer = document.querySelector('.slides-container');
  slidesContainer.innerHTML = '';

  images.forEach((imagePath)=>{
    console.log(imagePath);
    
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('slide');
    imgDiv.style.backgroundImage = `url(${imagePath})`;
    slidesContainer.appendChild(imgDiv)
  })

  slides = slidesContainer.querySelectorAll('.slide');
  slideIndex = 0;
  activeSlide = slides[slideIndex];
  activeSlide.classList.add('active')

};

function populateCarousel(images){
  const carousel = document.querySelector('.carousel');
  carousel.innerHTML = '';

  images.forEach((imagePath)=>{
    console.log(imagePath);
    
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('carousel-item');
    imgDiv.style.backgroundImage = `url(${imagePath})`;
    carousel.appendChild(imgDiv)
  })

  carouselItems = document.querySelectorAll('.carousel-item');
  currentIndex = 0;
};

function moveNext() {
  moveSlide("left");
}

function movePrevious() {
  moveSlide("right");
}

function moveSlide(direction) {
  if (isTransitioning) return;

  isTransitioning = true;
  let nextIndex;

  if (direction === "left") {
    nextIndex = slideIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0;
    }
  } else {
    nextIndex = slideIndex - 1;
    if (nextIndex < 0) {
      nextIndex = slides.length - 1;
    }
  }

  const currentSlide = slides[slideIndex];
  const nextSlide = slides[nextIndex];
  let slideDirection = direction === "left" ? "left" : "right";

  currentSlide.classList.add(`slideout-${slideDirection}`);

  nextSlide.classList.add("active", `slidein-${slideDirection}`);

  setTimeout(() => {
    currentSlide.classList.remove("active", `slideout-${slideDirection}`);
    isTransitioning = false;
  }, 1000);

  setTimeout(() => {
    nextSlide.classList.remove(`slidein-${slideDirection}`);
    isTransitioning = false;
  }, 1000);

  slideIndex = nextIndex;
}

//carousel
function moveToNextSlide() {
  updateCarousel(currentIndex);
}

function startLooping() {
  intervalId = setInterval(moveToNextSlide, 800);
}

function stopLooping() {
  clearInterval(intervalId);
}

startLooping();

carousel.addEventListener("mouseenter", stopLooping);
carousel.addEventListener("mouseleave", startLooping);

function updateCarousel(index) {
  const clone = carouselItems[index].cloneNode(true);
  const currentItem = carouselItems[index];

  const nextIndex = index++;
  const nextItem = carouselItems[nextIndex];

  setTimeout(() => {
    currentItem.parentNode.removeChild(currentItem);
    carousel.appendChild(clone);
    nextItem.classList.add("active", "slidein-left");
  }, 1000);

  setTimeout(() => {
    nextItem.classList.remove("slidein-left");
    currentIndex = nextIndex;

    carouselItems = document.querySelectorAll(".carousel-item");
  }, 1000);
}
});