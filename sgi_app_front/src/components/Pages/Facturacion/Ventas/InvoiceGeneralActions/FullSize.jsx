import { UilExpandAlt, UilCompressAlt } from '@iconscout/react-unicons'
export default function onChangeSize(fullSize, setFullSize, condition) {
    const changeSize = {
        icon: !fullSize ? <UilExpandAlt   /> : <UilCompressAlt />,
        label: !fullSize ? 'Expandir' : 'Comprimir',
        condition: () => !condition,
        action: () => setFullSize(!fullSize)
    }

    return changeSize
}
