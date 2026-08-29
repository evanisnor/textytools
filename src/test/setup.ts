let mockPathname = "/apogee";

const mockRouter = {
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push: jest.fn((path: string) => {
    mockPathname = path;
  }),
  replace: jest.fn((path: string) => {
    mockPathname = path;
  }),
  prefetch: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useParams: () => ({}),
  usePathname: () => mockPathname,
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  mockPathname = "/apogee";
  jest.clearAllMocks();
});
