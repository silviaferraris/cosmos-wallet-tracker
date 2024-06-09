import dynamic from 'next/dynamic';

const WalletInteraction = dynamic(() => import('../components/WalletInteraction'), { ssr: false });

const Home = () => {
  return (
    <div>
      <WalletInteraction />
    </div>
  );
};

export default Home;
