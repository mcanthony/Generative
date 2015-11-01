#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class Raytracing01App : public App {
  public:
	void setup() override;
	void mouseDown( MouseEvent event ) override;
	void update() override;
	void draw() override;
    
    CameraOrtho         mCam;
    CameraPersp			mCamPersp;
	gl::GlslProgRef		mGlsl;
    gl::BatchRef		mBatch;
};

void Raytracing01App::setup()
{
    setWindowPos(0, 0);
    setWindowSize(1024, 1024);
    
    mGlsl = gl::GlslProg::create( loadAsset( "tracing.vert" ), loadAsset( "tracing.frag" ) );
    mGlsl->uniform("resolution", vec2(getWindowWidth(), getWindowHeight()));
}

void Raytracing01App::mouseDown( MouseEvent event )
{
}

void Raytracing01App::update()
{
}

void Raytracing01App::draw()
{
	gl::clear( Color( 0, 0, 0 ) );
    mGlsl->uniform("time", (float)getElapsedFrames() * .1f);
    gl::ScopedGlslProg glslScope( mGlsl );
    gl::drawSolidRect(getWindowBounds());
}

CINDER_APP( Raytracing01App, RendererGl( RendererGl::Options().msaa( 16 ) ) )
