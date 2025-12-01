import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex">
      <div className="relative w-1/2 min-h-screen overflow-hidden">
        <Image
          src="/bg-auth.png"
          alt="bg-auth"
          fill={true}
          className="object-cover object-left"
        />
      </div>
      <div className="w-1/2 min-h-screen flex flex-col">{children}</div>
    </div>
  );
}
