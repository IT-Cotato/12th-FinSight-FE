export interface Interest {
  id: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

export const INTERESTS: Interest[] = [
  { id: '금융', image: '/img-금융.png', imageWidth: 54, imageHeight: 50 },
  { id: '증권', image: '/img-증권.png', imageWidth: 60, imageHeight: 50 },
  { id: '산업/재계', image: '/img-산업재계.png', imageWidth: 52, imageHeight: 50 },
  { id: '중기/벤쳐', image: '/img-중기벤쳐.png', imageWidth: 43, imageHeight: 50 },
  { id: '부동산', image: '/img-부동산.png', imageWidth: 71, imageHeight: 50 },
  { id: '글로벌 경제', image: '/img-글로벌경제.png', imageWidth: 69, imageHeight: 50 },
  { id: '생활경제', image: '/img-생활경제.png', imageWidth: 48, imageHeight: 50 },
  { id: '경제 일반', image: '/img-경제일반.png', imageWidth: 52, imageHeight: 50 },
];