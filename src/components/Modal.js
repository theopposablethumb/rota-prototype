let Modal = (props) => {

    let closeModal = (e) => {
        e.preventDefault();
        props.display();
    }

    let confirmModel = (e, type) => {
        e.preventDefault();
        props.confirm(type);
    }

    let renderBullets = () => {
        if (props.content.bullets) {
            return <ul>{props.content.bullets.map(bullet => {return(<li key={bullet}>{bullet}</li>)})}</ul>;
        } else {
            return null;
        }
    }

    if (props.content !== null) {
        return (
            <div className='modal'>
                <div>
                    <h2>{props.content.heading}</h2>
                    <p>{props.content.content}</p>
                    {renderBullets()} 
                    <div className="actions">
                        {props.content.options.map(option => {
                            if (option.type === 'confirm') {
                                return <button onClick={(e) => confirmModel(e, props.content.type)} key={option.label}>{option.label}</button>
                            } else {
                                return <button onClick={(e) => closeModal(e)} key={option.label}>{option.label}</button>
                            }
                            
                        })}
                    </div>
                </div>
            </div>
        )
        
    } else {
        return null;
    }
    
}

export default Modal;