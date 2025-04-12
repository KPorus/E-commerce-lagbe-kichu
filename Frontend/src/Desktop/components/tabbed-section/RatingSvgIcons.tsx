import { Dispatch, SetStateAction } from "react";
import styles from "./ratingSvgIcons.module.scss";
type IProps = {
  userReview: number;
  setRating: Dispatch<SetStateAction<number>>;
  iconWidth: number;
  iconHeight: number;
};
const RatingSvgIcons = ({
  setRating,
  userReview,
  iconHeight,
  iconWidth,
}: IProps) => {
  return (
    <div className={styles.reviewContiner}>
      {[1, 2, 3, 4, 5].map((Item, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          width={iconWidth}
          height={iconHeight}
          viewBox="0 0 13 13"
          fill={userReview > index ? "#f90" : "none"}
          stroke="#FF9900"
          className="cursor-pointer"
          onTouchMove={() => setRating(Item)}
          onClick={() => {
            setRating(Item);
          }}
        >
          <path
            d="M6.5 0L4.49083 4.07133L0 4.72045L3.25 7.89097L2.48166 12.3641L6.5 10.2534L10.5183 12.3641L9.75 7.89097L13 4.72486L8.50917 4.07133L6.5 0Z"
            fill={userReview > index ? "#f90" : "#ffffff"}
          />
        </svg>
      ))}
    </div>
  );
};

export default RatingSvgIcons;
