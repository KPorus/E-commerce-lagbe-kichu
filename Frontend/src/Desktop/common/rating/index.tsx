

const Rating = ({ value }: { value: number }) => {
    const normalizedRating = Math.min(5, Math.max(0, value));
  
    // Calculate the number of filled and empty stars
    const filledStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 !== 0;
  
    const stars = Array.from({ length: 5 }, (_, index) => {
      if (index < filledStars) {
        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
          >
            <path
              d="M6.5 0L4.49083 4.07133L0 4.72045L3.25 7.89097L2.48166 12.3641L6.5 10.2534L10.5183 12.3641L9.75 7.89097L13 4.72486L8.50917 4.07133L6.5 0Z"
              fill="#FF9900"
            />
          </svg>
        );
      }
      if (index === filledStars && hasHalfStar) {
        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            stroke="#FF9900"
          >
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="50%"
                  style={{ stopColor: "#FF9900", stopOpacity: 1 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#FFFFFF", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            
            <path
              d="M6.5 0L4.49083 4.07133L0 4.72045L3.25 7.89097L2.48166 12.3641L6.5 10.2534L10.5183 12.3641L9.75 7.89097L13 4.72486L8.50917 4.07133L6.5 0Z"
              // fill="#FFFFFF"
              // fill="#FF9900"
              fill="url(#grad)"
            />
          </svg>
        );
      }
      return (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          stroke="#FF9900"
        >
          <path
            d="M6.5 0L4.49083 4.07133L0 4.72045L3.25 7.89097L2.48166 12.3641L6.5 10.2534L10.5183 12.3641L9.75 7.89097L13 4.72486L8.50917 4.07133L6.5 0Z"
            fill="#fffff"
          />
        </svg>
      );
    });
  
    return <div id="ts--mobile-rating" className="flex gap-[2px]">{stars}</div>;
  };
  
  export default Rating;
  