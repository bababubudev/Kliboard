import { useState } from "react";

function UnsavedInboxDetail(props: { space_name: string }) {
    const [text, setText] = useState<string>("");
    const [removal, setRemoval] = useState<Number>(0);

    return (
        <>
            <h1>Hello {props.space_name}</h1>
        </>
    );
}

export default UnsavedInboxDetail