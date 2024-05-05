import { useState, React, useEffect } from "react";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";
import { SYSTEM_URL } from "../global";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function checkIfUsernameAndPasswordIsCorrect() {
    setLoading(true);

    let checkUserLoggedIn = false;

    await fetch(SYSTEM_URL + "login/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          alert("username or password is incorrect");
        }

        return response.json();
      })
      .then((data) => {
        if (
          data.detail === "No active account found with the given credentials"
        ) {
          return;
        }
        localStorage.setItem("token", data.access);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("is_superuser", data.user.is_superuser);
        navigate("/vendors", { replace: true });
        checkUserLoggedIn = true;
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });

    if (checkUserLoggedIn) {
      if (localStorage.getItem("user_type") === "supervisor") {
        await fetch(
          SYSTEM_URL + "company_supervisor/" + localStorage.getItem("user_id"),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
          .then((response) => {
            // console.log(response.status);
            if (response.status === 401) {
              alert("username or password is incorrect");
              return;
            }
            if (response.status === 200) {
              return response.json();
            }
          })
          .then((data) => {
            if (data.detail) {
              // console.log(data);

              alert(data.detail);
              return;
            }

            navigate("/vendors", { replace: true });
          })
          .catch((error) => {
            console.log(error);
            alert(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div
          className="container-fluid"
          id="loginPage"
          style={{
            width: window.innerWidth,
            height: window.innerHeight,
            marginLeft: "-12px",
          }}
        >
          <form
            style={{
              minHeight: window.innerHeight,
              display: "grid",
              alignItems: "center",
            }}
          >
            <div
              className="container-fluid p-4 bg-light  text-center text-dark"
              style={{
                borderRadius: "50px",
                height: "500px",
                width: window.innerWidth / 1.2,
              }}
            >
              <div className="container text-primary  pt-4 pb-4 mb-4 rounded-circle">
                <h2>
                  <b> Baly Payment System </b>
                </h2>
              </div>
              <div className="row d-flex justify-content-center align-items-center p-4 m-1">
                <div className="col-md-6 m-1">
                  <div className="container-fluid">
                    <input
                      type="text"
                      className="form-control text-center"
                      style={{ backgroundColor: "#e6e6e6" }}
                      id="email"
                      placeholder="اسم المستخدم"
                      name="email"
                      onChange={handleUsername}
                    />
                  </div>
                </div>
                <div className="col-md-6 m-1">
                  <div className="container-fluid">
                    <input
                      type="password"
                      className="form-control text-center"
                      style={{ backgroundColor: "#e6e6e6" }}
                      id="pwd"
                      placeholder="كلمة السر"
                      name="pswd"
                      onChange={handlePassword}
                    />
                  </div>
                </div>
              </div>

              <button
                id="loginButton"
                className="btn btn-primary "
                onClick={async () => {
                  await checkIfUsernameAndPasswordIsCorrect();
                }}
                onKeyDown={async () => {
                  await checkIfUsernameAndPasswordIsCorrect();
                }}
              >
                <b> دخول</b>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Login;
