import cube from "/cube.webp";

function HeroCards() {
  return (
    <div className="relative z-0">
      <div className="relative w-full h-full flex justify-center items-center">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl transform -rotate-6 shadow-lg scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl transform rotate-6 shadow-lg scale-110"></div>
          <div className="relative rounded-3xl overflow-hidden shadow-lg hover:scale-110 transition-transform duration-500 hero-card">
            <img
              src={cube}
              alt="Cube"
              className="w-full h-auto object-cover"
              width="1200"
              height="800"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { HeroCards };