import './DondeEstamos.css';

const DondeEstamos = () => {
    return (
        <div className='container mt-0'>
            <div className='col-md-12 '>
                <p className='text-left h5 m-3'>Donde estamos:</p>
            </div>
            <div className="col-md-12 d-flex justify-content-center map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.448239960358!2d-68.84085262461177!3d-32.88631516884348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed2dd83f7%3A0xf41c7ab7e3522157!2sAv.%20San%20Mart%C3%ADn%20%26%20Av.%20Las%20Heras%2C%20Capital%2C%20Mendoza!5e0!3m2!1ses!2sar!4v1713369845039!5m2!1ses!2sar"
                    width="600"
                    height="450"
                    style={{ border: '0' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className='col-md-12 mb-5'
                ></iframe>
            </div>
        </div>
    );
};

export default DondeEstamos;