const Main = ({children}: {children: React.ReactNode }) => {
  return (
      <div className="bg-red-500 w-full">
          {children}
      </div>
  );
}

export default Main;