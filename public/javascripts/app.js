const Router = ReactRouterDOM.BrowserRouter;
const Switch = ReactRouterDOM.Switch;
const Route = ReactRouterDOM.Route;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const useLocation = ReactRouterDOM.useLocation;
const Link = ReactRouterDOM.Link;

const handleSubmit = (files, history, setUploading) => {
  setUploading(true);
  if (files.length === 0) {
    return setUploading(false);
  }
  for (var i = 0; i < 1; i++) {
    const file = files[i];
    const imageType = /^image\//;
    if (!imageType.test(file.type)) {
      setUploading(false);
      continue;
    }
    //Preview
    const img = document.createElement("img");
    const preview = document.querySelector(".dropbox");
    preview.innerHTML = "";
    preview.appendChild(img);
    var reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
    //Uploade
    const data = new FormData();
    data.append("file", file, file.name);
    fetch("/uploads", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        setUploading(false);
        if (res.success) history.push(`/success/${res?.img}`);
        else Alert("Error ❌");
      })
      .catch((error) => {
        Alert("Error ❌");
        setUploading(false);
      });
  }
};

const preventDefault = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

const drop = (e, history, setUploading) => {
  preventDefault(e);
  handleSubmit(e.dataTransfer.files, history, setUploading);
};

const Alert = (msg) => {
  const popup = document.createElement("span");
  const conteiner = document.querySelector(".container");
  popup.classList.add("popup");
  popup.innerText = msg;
  conteiner.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 5000);
};

const copyLink = () => {
  const copyText = document.querySelector(".link");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  Alert("copied ✅");
};

const Uploader = () => {
  const [uploading, setUploading] = React.useState(false);
  const history = useHistory();
  return (
    <>
      {uploading && (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      )}
      <h1>Upload your image</h1>
      <h2>File should be Jpeg, Png,...</h2>
      <div className="dropboxContainer">
        <div
          className="dropbox"
          onDrop={(e) => drop(e, history, setUploading)}
          onDragOver={preventDefault}
          onDragEnter={preventDefault}
        ></div>
      </div>
      <h2>Or</h2>
      <input
        type="file"
        style={{ display: "none" }}
        name="uploaderInput"
        id="uploaderInput"
        onChange={(e) => handleSubmit(e.target.files, history, setUploading)}
      />
      <div className="btnContainer">
        <label htmlFor="uploaderInput" className="btn">
          Choose a file
        </label>
      </div>
    </>
  );
};

const Success = () => {
  let { img } = useParams();
  const link = document.location.origin + "/images/uploads/" + img;
  React.useEffect(() => {
    Alert("⚠️ The image will be deleted in 2 minutes");
  }, []);
  return (
    <div className="success">
      <div className="successIcon">
        <img src="https://img.icons8.com/color/48/000000/ok.png" />
      </div>
      <h1>Uploaded Successfully!</h1>
      <div className="dropboxContainer">
        <div className="dropbox img">
          <img src={`/images/uploads/${img}`} />
        </div>
      </div>
      <div className="btnContainer">
        <div className="copy">
          <input type="text" className="link" value={link} readOnly />
          <button className="btn" onClick={copyLink}>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

const Page404 = () => {
  return (
    <>
      <h1 style={{ marginTop: "60px", fontSize: "28px" }}>Error - 404</h1>
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <Link to="/" className="btn">
          Home
        </Link>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div className="uploaderContainer">
        <Switch>
          <Route exact path="/">
            <Uploader />
          </Route>
          <Route exact path="/success/:img">
            <Success />
          </Route>
          <Route>
            <Page404 />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
