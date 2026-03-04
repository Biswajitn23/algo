import './SectionDivider.css';

export default function SectionDivider() {
    return (
        <div className="section-divider" aria-hidden="true">
            <span className="section-divider__line" />
            <span className="section-divider__accent section-divider__accent--left" />
            <span className="section-divider__dot" />
            <span className="section-divider__accent section-divider__accent--right" />
        </div>
    );
}
