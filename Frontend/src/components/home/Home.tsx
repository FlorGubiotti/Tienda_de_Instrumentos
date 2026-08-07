import "./Home.css";

const Home = () => {
    return (
        <div className="container text-center">
            <h1 className="pt-serif-regular-italic"><b>MUSICAL HENDRIX</b></h1>
            <div id="carouselExample" className="carousel slide mt-5" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://images.pexels.com/photos/68710/pexels-photo-68710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 carousel-image" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.pexels.com/photos/5855909/pexels-photo-5855909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 carousel-image" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.pexels.com/photos/8722689/pexels-photo-8722689.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 carousel-image" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.pexels.com/photos/3774606/pexels-photo-3774606.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 carousel-image" alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <p className="description pt-serif-regular-italic">Musical Hendrix es una tienda de instrumentos musicales con más de 15 años de experiencia. Tenemos el conocimiento y la capacidad para asesorarte en tus compras musicales.</p>
        </div>
    );
};

export default Home;