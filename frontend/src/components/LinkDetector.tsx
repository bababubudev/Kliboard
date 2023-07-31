interface DetectorProp {
    text: string;
}

function check_link(text: string): boolean {
    const url_pattern = /^(http:\/\/|https:\/\/)?(www\.)?[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+(\/\S*)?$/;
    return url_pattern.test(text);
}

function extract_domain(url: string): string {
    const regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9]+(\.[a-zA-Z]{2,})+)(\/\S*)?$/;
    const match = url.match(regex);
    return match ? match[1] : "";
}

function LinkDetector({ text }: DetectorProp) {
    const separators = [" ", "\n"];
    const each = text.split(new RegExp(separators.join("|"), "g"));

    let link = "";
    each.forEach(elem => {
        if (!check_link(elem)) return;

        if (elem.startsWith("https://") || elem.startsWith("http://")) {
            link = elem;
            return;
        }

        link = "https://" + elem;
    });


    return (
        <>
            {link &&
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreffer"
                    className="link"
                >
                    {extract_domain(link)}
                </a>
            }
        </>

    );
}

export default LinkDetector;