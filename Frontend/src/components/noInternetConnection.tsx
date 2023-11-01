
const NoInternetConnection = () => {
    return (
        <div className="flex justify-center h-screen items-center text-xl"><div>
            <p>Network Error. Please Check Your Internet Connection And Try Again</p>
            <div className="flex justify-center items-center mt-2">
                <button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded-3xl">Try Again</button>

            </div>
        </div></div>

    )
}

export default NoInternetConnection