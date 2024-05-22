export default function Notification() {
    return (
        <div className="rounded-xl border-2 border-gray-100 bg-white">
            <div className="flex items-start gap-4 p-4 sm:p-6 lg:p-8">

                <div>
                    <h3 className="font-medium sm:text-lg">
                        <a href="#" className="hover:underline"> Ordinazione #123456 </a>
                    </h3>

                    <p className="line-clamp-2 text-sm text-gray-700">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus, accusantium temporibus
                        iure delectus ut totam natus nesciunt ex? Ducimus, enim.
                    </p>
                </div>
            </div>
        </div>

    );
}