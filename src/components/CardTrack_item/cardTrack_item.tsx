import s from './cardTrack_item.module.scss';

interface CardTrack_item {
  track_name: string;
  track_img: string;
  trac_time: number;
}

export default function CardTrack_item({ track_name, track_img, trac_time }: CardTrack_item) {
  return(
    <div className={s.container}>
      
    </div>
  )
}