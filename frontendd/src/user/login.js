const React = require('react');
const { useState} = React;


const Login = () => {
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [isValid, setIsValid] = useState(null);
    return (
        
    <div className="flex flex-col md:flex-row h-screen">
    {/* Login */}
    <div className="w-full md:w-1/2 h-full bg-white flex flex-col items-center justify-center p-4">
      <div className="flex flex-col w-full md:w-3/5 h-auto md:h-1/2">
        <div>
          {/* Judul */}
          <div className="title flex flex-col mb-4 ">
            <span className="font-semibold font-['ubuntu'] text-4xl mb-1">Masuk</span>
            <span className="font-normal font-['ubuntu'] text-gray-500 text-l">Selamat datang kembali, Silahkan mengisi NISN</span>
          </div>
          {/* Form */}
          <div className="form-group flex flex-col">
            <label className="font-semibold mt-4 font-['ubuntu'] text-l mb-2">NISN</label>
            <input type="text" className="bg-blue-100 rounded-lg shadow-sm border border-gray-500 p-3 input font-['ubuntu']" placeholder="NISN" />
            {isValid === false && (<span className="text-red-500">NISN tidak valid</span>)}
          </div>
          {/* Btn-Masuk */}
          <div className="mt-14 text-center">
            <button className="mb-3 btn w-full bg-blue-600 text-white font-semibold font-['ubuntu'] text-l rounded-lg shadow-sm p-3">Masuk</button>
            <span className="font-['ubuntu'] text-gray-500 text-l">Masuk Sebagai Guru?<a href={"/login-guru"} className="text-blue-600 text-l font-['ubuntu']">mampir sini</a></span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
    )
}

export default Login