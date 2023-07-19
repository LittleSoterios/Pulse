import './Loading.css'
import { FallingLines } from "react-loader-spinner";


export const Loading = () => {
  return (
    <>
      <div className="loading-container">
        <FallingLines
          color="#FFFFFF"
          width="100"
          visible={true}
          ariaLabel='falling-lines-loading'
        />
      </div>
    </>
  );
};