import React from "react";
import Lottie from "lottie-react";
import pageNotFound from "../lottieAnimations/pageNotFound.json";
import { Button } from "@mui/joy";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Lottie style={styles.lottie} animationData={pageNotFound} />
        <h3 style={styles.text}>Lo sentimos, página no encontrada :(</h3>
        <Button
          color="primary"
          onClick={() => {}}
          size="large"
          variant="outlined"
          startDecorator={
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGElEQVR4nOWaW2gcVRzGx6KiCIL44IP6Kj4JPoivRiq5NGlr2/Ri95Zk5yQllFYQi2KtCIWKKPRJiiTTJE1DbFnTZnNt7Sa15LKbJpvNbi7tbjInDblfN02TbJv95Ewy073MJq2S3R384IPd2Znl/9tzvv85MyzH/V91BniRmdOyTO4Fo75z0q+/O7lkdM8XclqU0TXXq7OPItSGrmkxx7PwMacl8WIQOb2L0DvGwmB0jjEYXLOteb7FtzgtiFCAmR98AqNrLhzGPgp9x/gTk2v+Agfs4LQAQjac5w3A0DUVBWTomHxo6PabOa2AkA3n9j9ioxEN1DXty3MtfsBpBYQws/x4/NDZI/JjH4PBOdN0/N7065wmQKicn8cwumajRkfXMREwueZ/5bQCQuT83F+BoXNSZbpNzZh6/fs0A0LY6IgsP0vQReRHz4CcM73Gfv/7mgAhMtDQGkzuBegdEe3aMRY0ds9ajEN4JSlADM4pyVsBmVl+nDMq68/EqtE9fzphILkDj7CvtgupRdWS916z45TTt3V+7i1Df3dCLT/juX2LKXEHSRNqFAjZq8JOWCznkO97vCVQbt/D6O2OXcqPM79r6e24gURCMEP4RLJg/f3Z89MzH92uHWNrpp65smw3Xk4oyKKQhpO9k8/ermNsd3Qd4zMJBWGu++P75+5weQPLLPzQO8ZxyDaAVKEG2w9SbN0UZE1IwXcOV9g1Vc1lKBxa2RxIDCK9tF75zm0H2d/gigK5LZAwGOclc9g17NhsRTaK2xuQT4MxYVJDvnPbQczeADJKG6Jgvir6DV7hoAITes3wFbNyfKDqBH70eBMPQihw+O9B1aykFV3Hz8U/YVbICDu/QFxDWWs1/OV716ffxU/R3PhL4kH4oSCyKptUYZj3F10NP19cn07HfY9Q3STgcclnUaNGEgHCzNpmLBDm0HMzK25JbVV+f7pvGD3XTyUHCKGAvnMCmRW2KAh2TK3APX+2wuTxJ0fYSeQ0E4M40kKRXtaA9JJ6HGr2Sit3eKZ80mdSjoqtyL7hgdkXSCxIgRhepNLN7q9KjgXMPjtQ362sQww8oSCjlUac77RvvrhF2OicVl6zZ2R7qtqickTiDSKvB93V3+Db/qcB3szydj+nf0k5dtQxmliQquYyrJSmSTCBklTU2IpwfHB5U5C0i7Xr+RBqcfBWv/SwLynC/vW9KbTVnUVQSJGA5i4fQFF746Y3VftqOpUiMy7dwNH2kTiDiLDHKvBsTz+8lkJluu2+clt6LBQzKz1z2H31jupaQ7YbhANeIBTZvIhhteLYJvCCw4aZyweVIj63dki3xLGA2OK4q/xmnEE2pBvDazzFD4RiWa04tv3I/qtPuRVOL6nD4ab7UWuK0o5VbotT4wEi69gI3iUUpbF+7ciHE+yX/6LtwTN3t9R4gcgiQ0ghIrpjFWVwTiOrsvnp9sTSApNnIflAmM4AO/IpDDzFhGpxYlAajYzSxvUCi63SaOV5V5ILRNYxijd4inOEYlU1D94ADjS6pX2WlJ/Sehy5M5h8ILLMI3iPUFhj5qf3IfZea09Q+/0X4il28hSemPnpmkJmZVPygzCRDrzEU5wgFPPq+VnTBoiswhG8SSjOExFPkrL9Pq8KhvAhL6JZ8yCyCEUWoRjUPAjTl8N4lVCcIhR+TYPIMj/AO4SinIgIhoLstrSKnBbFD+MjnqJlV4Vtaf9Ntzb/tBO63Tljs2n7b1T/Rf8AX0rwI0EEc3QAAAAASUVORK5CYII="></img>
          }
          style={styles.button}
        >
          Volver al Dashboard
        </Button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  content: {
    textAlign: "center",
  },
  lottie: {
    width: "350px",
    height: "350px",
    textAlign: "center",
  },
  text: {
    color: "#192C33",
  },
  button: {
    color: "#192C33",
    borderColor: "#AAFF00",
    marginTop: "20px",
  },
};

export default NotFound;
