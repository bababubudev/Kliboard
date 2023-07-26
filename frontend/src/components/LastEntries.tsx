interface NamesProp {
    names: string[];
}

function LastEntries({ names }: NamesProp) {
    return (
        <div className="last-updated">
            <p id="box" className="box-shadow">Last Updated</p>
            <ul>
                {names && names.map((elem, index) => (
                    <li key={index}>{elem}</li>
                ))}
            </ul>
        </div>
    );
}

export default LastEntries;